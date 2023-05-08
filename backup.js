const { execSync } = require("child_process");
const fs = require("fs-extra");

// Vérifier que le dossier de backup est spécifié
if (process.argv.length < 3) {
    console.log("Utilisation: node backup.js <backup_folder>");
    process.exit(1);
}

console.log("Backup de la base de données en cours...");
execSync("mysqldump.exe objets_connectes_final -u root -p > ./dev/objets_connectes_final_backup.sql", { stdio: "inherit" });

// Copier les fichiers dans le dossier de backup en ignorant les dossiers node_modules
console.log("Copie des fichiers dans le dossier de backup...");
fs.copySync("./", process.argv[2], {
    filter: (src, dest) => {
        return !src.includes("node_modules");
    }
});

console.log("Backup terminé!");