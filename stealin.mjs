import YoutubeMusicApi from "youtube-music-api";
import fs from "fs";
import ytdl from "ytdl-core";
import zipper from "zip-local";

let zip_name = "";

function download(query) {
  const api = new YoutubeMusicApi();
  api.initalize().then((_) => {
    api.search(query).then((res) => {
      let result_types = [];
      res.content.forEach((result) => {
        result_types.push(result.type);
      });
      const album =
        res.content[result_types.findIndex((element) => element === "album")]
          .browseId;
      api.getAlbum(album).then((result) => {
        zip_name = result.title;
        fs.mkdirSync(zip_name);
        result.tracks.forEach((track) => {
          let song = track.name + " - " + track.artistNames;
          ytdl("https://www.youtube.com/watch?v=" + track.videoId).pipe(
            fs.createWriteStream(".\\" + result.title + "\\" + song + ".m4a")
          );
        });
      });
    });
  });
}
download("culture 2 migos");

setTimeout(() => {
  console.log(zip_name);
  zipper.sync.zip(".\\" + zip_name).save(zip_name + ".zip");
  setTimeout(() => {
    fs.rmdir(".\\" + zip_name, { recursive: true }, (err) => {
      if (err) {
        throw err;
      }
    });
  }, 1000);
}, 150000);
