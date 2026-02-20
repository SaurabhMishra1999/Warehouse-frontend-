{ pkgs, ... }: {
  # Install nodejs and firebase-tools
  packages = [pkgs.nodejs_20 pkgs.firebase-tools pkgs.rsync];

  # Configure the web preview and workspace hooks
  idx = {
    workspace = {
      # Runs when a workspace is first created to install backend dependencies
      onCreate = {
        npm-install = "npm install";
      };
      onStart = {
        start-server = "node server.js";
      };
    };
    previews = {
      enable = true;
      previews = {
        web = {
          # Command to start the server
          command = ["node" "server.js"];
          # The manager to use for the preview
          manager = "web";
        };
      };
    };
  };
}
