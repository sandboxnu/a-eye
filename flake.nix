{
  description = "A-Eye demos and visualizations";

  inputs = { nixpkgs = { url = "nixpkgs/nixos-unstable"; }; };

  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" "i686-linux" "x86_64-darwin" "aarch64-linux" ];
      forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f system);
      mkPackage = path: system:
        let pkgs = import nixpkgs { inherit system; };
        in import path { inherit pkgs; };
      packages = system: { frontend = mkPackage ./. system; };
    in {
      defaultPackage = forAllSystems (mkPackage ./.);
      packages = forAllSystems packages;
    };
}
