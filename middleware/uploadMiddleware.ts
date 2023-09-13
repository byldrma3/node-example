import multer from "multer";

const storage = multer.diskStorage({
  destination: "./uploads", // Yüklenen fotoğrafların saklanacağı klasör
  filename: function (req, file, cb) {
    const date = new Date().toISOString().split("T")[0];
    const time = new Date().getTime();
    const formattedName = `${date}-${time}-${file.originalname}`;
    cb(null, formattedName);
  },
});

const upload = multer({ storage: storage });

export default upload;
