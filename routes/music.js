const express = require("express");

const router = express.Router();


// Model Ulimiz:
const Music = require('../model/Musec');


// Musiqa qo'shish sahifasi
router.get("/music/add", (req, res) => {
  res.render("music_add", { title: `Musiqa qo'shish sahifasi` });
});

// Bosh sahifa rooteri
router.get("/", (req, res) => {
  Music.find({}, (err, musics) => {
    if (err) console.log(err);
    else {
      res.render("index", { title: "Bosh sahifa", musics });
    }
  });
});
// Musiqa qo'shish sahifasi POST METHOD orqali bazaga jo'natish
router.post("/music/add", (req, res) => {

  req.checkBody('name', `Isim bo'sh bo'lmasligi kerak`).notEmpty()
  req.checkBody('singer', `Ijrochi bo'sh bo'lmasligi kereak`).notEmpty()
  req.checkBody('comment', `izoh bo'sh bo'lmasligi kereak`).notEmpty()

  const errors = req.validationErrors();
  if(errors){
    res.render('music_add', {
       title: 'Musiqa qoshish valid',
       errors: errors
    })
  }
  else{
    const music = new Music();
    music.name = req.body.name;
    music.singer = req.body.singer;
    music.comment = req.body.comment;
  
    music.save((err) => {
      if (err) console.log(err);
      else {
        req.flash('warning', `Musiqamiz muofiyaqali qo'shildi`)
        res.redirect("/");
      }
    });
  }



  
});

// music id oraqali kirvomiz
router.get("/musics/:id", (req, res) => {
  Music.findById(req.params.id, (err, music) => {
    res.render("musics", {
      music: music,
    });
  });
});

// musiqa o'zartirish sahifasi id orqali oldik // sardor raximhon
router.get("/music/edit/:id", (req, res) => {
  Music.findById(req.params.id, (err, music) => {
    res.render("musics_edit", {
      title: `Musiqani o'zgartiramiz`,
      music: music,
    });
  });
});

// musiqa o'zartirish sahifasi id orqali oldik // sardor raximhon
router.post("/music/edit/:id", (req, res) => {
  const music = {};
  music.name = req.body.name;
  music.singer = req.body.singer;
  music.comment = req.body.comment;
  const query = { _id: req.params.id };

  Music.updateOne(query, music, (err) => {
    if (err) console.log(err);
    else {
      req.flash('success', `Musiqa muofiqatli almashdi`)
      res.redirect("/");
    }
  });
});


// musiqa o'chirish qismi
router.delete("/musics/:id", (req, res) => {
  let a = {id: req.params.id};
  Music.findOneAndDelete(a, (err) => {
    if (err) console.log(err);
    res.send('Success')
  });
});




module.exports = router;
