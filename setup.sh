#!/usr/bin/env bash
# ============================================================
# BloodNet — Setup Script
# Installs all dependencies and configures the project
# ============================================================

set -e  # Exit immediately on any error

# ---- Colors ----
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

# ---- Helpers ----
info()    { echo -e "${BLUE}[INFO]${RESET}  $*"; }
success() { echo -e "${GREEN}[OK]${RESET}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${RESET}  $*"; }
error()   { echo -e "${RED}[ERROR]${RESET} $*"; exit 1; }
section() { echo -e "\n${BOLD}${CYAN}===> $*${RESET}"; }

# ---- Banner ----
echo -e "${RED}"
cat << 'EOF'
  ____  _                 _ _   _      _   
 | __ )| | ___   ___   __| | \ | | ___| |_ 
 |  _ \| |/ _ \ / _ \ / _` |  \| |/ _ \ __|
 | |_) | | (_) | (_) | (_| | |\  |  __/ |_ 
 |____/|_|\___/ \___/ \__,_|_| \_|\___|\__|
                                             
  DBMS Project — Setup Script
EOF
echo -e "${RESET}"

# ---- Detect OS ----
section "Detecting operating system"
OS=""
if   [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
    if command -v apt-get &>/dev/null; then PKG_MGR="apt"; 
    elif command -v dnf &>/dev/null;    then PKG_MGR="dnf";
    elif command -v yum &>/dev/null;    then PKG_MGR="yum";
    else warn "Unknown Linux package manager. Manual install may be needed."; fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="mac"
    PKG_MGR="brew"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    OS="windows"
    warn "Windows detected. Please run this inside WSL2 or Git Bash."
fi
info "Detected OS: ${OS} (${OSTYPE})"

# ---- Check for sudo ----
SUDO=""
if [[ "$(id -u)" != "0" ]]; then
    if command -v sudo &>/dev/null; then
        SUDO="sudo"
        info "Running as non-root, will use sudo"
    else
        warn "Not root and no sudo found. Some installs may fail."
    fi
fi

# ================================================================
# STEP 1 — System Package Manager Update
# ================================================================
section "Step 1: Updating package manager"
if [[ "$OS" == "linux" && "$PKG_MGR" == "apt" ]]; then
    $SUDO apt-get update -qq && success "apt updated"
elif [[ "$OS" == "mac" ]]; then
    if ! command -v brew &>/dev/null; then
        info "Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    brew update && success "Homebrew updated"
fi

# ================================================================
# STEP 2 — PHP 8.x
# ================================================================
section "Step 2: PHP 8"
if command -v php &>/dev/null; then
    PHP_VER=$(php -r 'echo PHP_MAJOR_VERSION;')
    if [[ "$PHP_VER" -ge 8 ]]; then
        success "PHP $(php -r 'echo PHP_VERSION;') already installed"
    else
        warn "PHP $PHP_VER found, but version 8+ is recommended"
    fi
else
    info "Installing PHP 8..."
    if [[ "$OS" == "linux" && "$PKG_MGR" == "apt" ]]; then
        $SUDO apt-get install -y php8.1 php8.1-cli php8.1-mysql php8.1-mbstring php8.1-xml
    elif [[ "$OS" == "mac" ]]; then
        brew install php
    fi
    success "PHP installed: $(php --version | head -1)"
fi

# ================================================================
# STEP 3 — MySQL / MariaDB
# ================================================================
section "Step 3: MySQL / MariaDB"
if command -v mysql &>/dev/null; then
    success "MySQL already installed: $(mysql --version)"
else
    info "Installing MySQL..."
    if [[ "$OS" == "linux" && "$PKG_MGR" == "apt" ]]; then
        $SUDO apt-get install -y mysql-server
        $SUDO systemctl start mysql 2>/dev/null || true
        $SUDO systemctl enable mysql 2>/dev/null || true
    elif [[ "$OS" == "mac" ]]; then
        brew install mysql
        brew services start mysql
    fi
    success "MySQL installed"
fi

# ================================================================
# STEP 4 — Apache / PHP built-in server check
# ================================================================
section "Step 4: Web Server"
if command -v apache2 &>/dev/null || command -v httpd &>/dev/null; then
    success "Apache already installed"
elif command -v php &>/dev/null; then
    success "PHP built-in server available (php -S localhost:8000)"
else
    info "Installing Apache..."
    if [[ "$OS" == "linux" && "$PKG_MGR" == "apt" ]]; then
        $SUDO apt-get install -y apache2 libapache2-mod-php8.1
        $SUDO systemctl start apache2
    elif [[ "$OS" == "mac" ]]; then
        brew install httpd
    fi
fi

# ================================================================
# STEP 5 — Database Setup
# ================================================================
section "Step 5: Database setup"

DB_HOST="localhost"
DB_USER="root"
DB_NAME="blood_donor_network"

read -rp "  Enter MySQL root password (leave blank if none): " DB_PASS

SQL_CMD="mysql -h $DB_HOST -u $DB_USER"
if [[ -n "$DB_PASS" ]]; then SQL_CMD="$SQL_CMD -p$DB_PASS"; fi

if $SQL_CMD -e "USE $DB_NAME;" 2>/dev/null; then
    warn "Database '$DB_NAME' already exists."
    read -rp "  Re-import schema? (y/N): " REIMPORT
    if [[ "$REIMPORT" =~ ^[Yy]$ ]]; then
        $SQL_CMD < database.sql && success "Schema imported"
    fi
else
    info "Creating database and importing schema..."
    $SQL_CMD < database.sql && success "Database '$DB_NAME' created with sample data"
fi

# ================================================================
# STEP 6 — Update API config
# ================================================================
section "Step 6: Updating API config"

CONFIG_FILE="api/config/database.php"
if [[ -f "$CONFIG_FILE" ]]; then
    # Update password in config
    sed -i.bak "s/private \\\$password = .*/private \$password = \"$DB_PASS\";/" "$CONFIG_FILE"
    rm -f "${CONFIG_FILE}.bak"
    success "api/config/database.php updated"
else
    warn "Config file not found at $CONFIG_FILE"
fi

# ================================================================
# STEP 7 — CORS & PHP Extensions
# ================================================================
section "Step 7: PHP Extensions"
REQUIRED_EXTS=("pdo" "pdo_mysql" "mbstring" "json")
for ext in "${REQUIRED_EXTS[@]}"; do
    if php -m | grep -q "$ext"; then
        success "  php-$ext ✓"
    else
        warn "  php-$ext not found — installing..."
        if [[ "$OS" == "linux" && "$PKG_MGR" == "apt" ]]; then
            $SUDO apt-get install -y "php-$ext" 2>/dev/null || warn "Could not auto-install php-$ext"
        fi
    fi
done

# ================================================================
# STEP 8 — Start server
# ================================================================
section "Step 8: Launch development server"

PROJECT_DIR="$(pwd)"
PORT=8080

echo ""
echo -e "${GREEN}${BOLD}  Setup complete!${RESET}"
echo ""
echo -e "  To start the project, run ONE of the following:"
echo ""
echo -e "  ${CYAN}Option A — PHP built-in server:${RESET}"
echo -e "    ${BOLD}cd \"$PROJECT_DIR\" && php -S localhost:$PORT${RESET}"
echo ""
echo -e "  ${CYAN}Option B — Apache (symlink to web root):${RESET}"
if [[ "$OS" == "linux" ]]; then
echo -e "    ${BOLD}sudo ln -s \"$PROJECT_DIR\" /var/www/html/bloodnet${RESET}"
echo -e "    Then open: ${BOLD}http://localhost/bloodnet/${RESET}"
elif [[ "$OS" == "mac" ]]; then
echo -e "    ${BOLD}ln -s \"$PROJECT_DIR\" /usr/local/var/www/bloodnet${RESET}"
echo -e "    Then open: ${BOLD}http://localhost:8080/bloodnet/${RESET}"
fi
echo ""
echo -e "  ${CYAN}Demo login credentials:${RESET}"
echo -e "    Email:    john@example.com"
echo -e "    Password: password"
echo ""

# Ask to auto-start PHP server
read -rp "  Start PHP built-in server now on port $PORT? (Y/n): " START_SERVER
if [[ "$START_SERVER" =~ ^[Nn]$ ]]; then
    info "You can start manually: php -S localhost:$PORT"
else
    echo ""
    info "Starting PHP server at http://localhost:$PORT ..."
    info "Press Ctrl+C to stop."
    echo ""
    php -S "localhost:$PORT" -t .
fi
