const express = require('express');
const router = express.Router();
const dbconnect = require('../mysql/dbcon');
const { format } = require('date-fns');

router.get('/', (req, res) => {
    dbconnect.query('SELECT * FROM thread', (error, rows) => {
       
        if (error) {
            console.error(error);
        } else {
            const count = rows.filter(row => row.status === 'จบแล้ว').length;
            const count2 = rows.filter(row => row.status === 'ยังไม่จบ').length;

          const formattedRows = rows.map(row => ({
                ...row,
                date: format(row.date, 'dd MMMM yyyy'),
            }));

            res.render('theads', { data: formattedRows ,count:count,count2:count2});
        }
    });
});


router.get('/add', (req, res) => {
    res.render('theads/add',{
        topic : '',
        detail : '',
        image : '',
        synopsis : '',
        status : '',
    });
});

router.post('/add', (req, res) => {
    let topic = req.body.topic;
    let detail = req.body.detail;
    let image = req.body.image;
    let synopsis = req.body.synopsis;
    let status = req.body.status    ;

    let form_data = {
        topic: topic,
        detail: detail,
        image: image,
        synopsis: synopsis,
        status : status,
    }

    dbconnect.query('INSERT INTO thread SET ?', form_data, (err, result) => {
        if (err) {
            console.error(err);
            req.flash('error', err);
            res.render('theads/add', {
                topic: form_data.topic,
                detail: form_data.detail,
                image: form_data.image,
                synopsis: form_data.synopsis,
                status : form_data.status,
                error: req.flash('error')[0],
            });
        } else {
            res.redirect('/theads');
        }
    });
});
router.get('/watch/:id', (req, res) => {
    const id = req.params.id;

    dbconnect.query("SELECT * FROM thread WHERE id = ?", [id], (error, results) => {
        if (error) {
            console.error(error);
        } else if (results.length > 0) {
            res.render('theads/watch', {
                id: results[0].id,
                topic: results[0].topic,
                detail: results[0].detail,
                image: results[0].image,
                synopsis: results[0].synopsis,
                status : results[0].status
            });
        } else {

            res.status(404).send('Thread not found');
        }
    });
});

router.get('/delete',(req,res)=>{
    dbconnect.query('SELECT * FROM thread', (error, row) => {
        if (error) {
            console.error(error);
        } else {
            res.render('theads/delete', { data: row });
        }
    });

})

router.get('/search', (req, res) => {
    res.render('threads/search', { search: '' });
});

router.post('/search',(req,res)=>{
    let word = req.body.search
    
    dbconnect.query('SELECT * FROM thread WHERE UPPER(topic) LIKE ?', ['%' + word + '%'], (err, rows) => {
        const formattedRows = rows.map(row => ({
            ...row,
            date: format(row.date, 'dd MMMM yy'),
        }));
            res.render('theads/search', { data: formattedRows });
    });

})

router.get('/delete/:id', (req, res) => {
    let id = req.params.id;
    dbconnect.query('DELETE FROM thread WHERE id = ?', [id], (error) => {
        res.redirect('/theads/delete');
    });
});
module.exports = router;
