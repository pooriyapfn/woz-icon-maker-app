import sharp from "sharp";
import archiver from "archiver";
import fs from "fs-extra";
import path from "path";

export async function createAssetBundle(
  masterPath: string,
  outputDir: string,
  zipPath: string,
) {
  console.log("Resizing assets...");

  const sizes = [
    { name: "ios-icon-1024.png", width: 1024 },
    { name: "ios-icon-180.png", width: 180 },
    { name: "ios-icon-120.png", width: 120 },
    { name: "android-launcher-512.png", width: 512 },
    { name: "android-launcher-192.png", width: 192 },
    { name: "play-store.png", width: 512 },
  ];

  for (const size of sizes) {
    await sharp(masterPath)
      .resize(size.width, size.width)
      .toFile(path.join(outputDir, size.name));
  }

  console.log("Zipping...");
  return new Promise<void>((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", resolve);
    archive.on("error", reject);

    archive.pipe(output);
    archive.glob("*.png", { cwd: outputDir });
    archive.finalize();
  });
}
