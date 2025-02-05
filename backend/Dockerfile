FROM debian:latest

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    xz-utils \
    ca-certificates \
    gnupg \
    texlive \
    texlive-latex-extra \
    texlive-fonts-recommended \
    texlive-xetex \
    texlive-luatex \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js from the official NodeSource repository
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Set working directory
WORKDIR /app

# Copy backend files into the container
COPY . .

# Install Node.js dependencies
RUN npm install

# Start the Node.js server
CMD ["node", "server.js"]
