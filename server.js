/**
 * NPM Modules
 */
require('dotenv').config()
const path = require('path');
const mysql = require('mysql');
const express = require('express');
const uuid = require('uuid/v4');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

/**
 * Import configuration
 */
const dabataseOptions = require('./config/database');

// App
const app = express();

/**
 * Database connections
 */
const connection = mysql.createConnection(dabataseOptions);
connection.on('error', function (err) {
    console.log(err);
})
const sessionStore = new MySQLStore(dabataseOptions);
connection.connect();

/**
 * Passport config
 */
passport.use(new LocalStrategy(
    (username, password, done) => {
        connection.query('SELECT * FROM usuarios WHERE usuario = ?', [username], (err, rows, fields) => {
            if (err) {
                return done(err);
            }
            const user = rows[0];
            if (!user) {
                return done(null, false);
            }
            if (user.clave != password) {
                return done(null, false);
            }
            return done(null, user);
        });

    }
));

/**
 * User handling
 */
passport.serializeUser((user, done) => {
    done(null, user.ID);
});

passport.deserializeUser(function (id, done) {
    connection.query('SELECT * FROM usuarios WHERE id = ?', [id], (err, rows, fields) => {
        if (err) {
            return done(err);
        }
        const user = rows[0];
        return done(null, user);
    });
});



/**
 * Middlewares
 */
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
    genid: (req) => {
        return uuid()
    },
    key: process.env.KEY,
    secret: process.env.SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/static'));

/**
 * Routes
 */

// create the login get and post routes
app.get('/login', (req, res) => {
    if (!req.isAuthenticated()) {
        res.sendFile(path.join(__dirname, "views/login/login.html"));
    } else {
        res.redirect('/home');
    }
});

app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) { return res.send("An error ocurred!"); }
        if (user) {
            req.login(user, (err) => {
                console.log(err);
                return res.redirect('/');
            });
        } else {
            return res.send("Wrong credentials");
        }
    })(req, res, next);
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

/**
 * Must be authenticated
 */
app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.sendFile(path.join(__dirname, "views/dashboard/dashboard.html"));
    } else {
        res.redirect('/login');
    }
});

app.get('/empresas', (req, res) => {
    if (req.isAuthenticated()) {
        res.sendFile(path.join(__dirname, "views/company/company.html"));
    } else {
        res.redirect('/login');
    }
});

app.post('/empresas', (req, res) => {
    if (req.isAuthenticated()) {
        connection.query('INSERT INTO empresas (nombre, nit) VALUES (?, ?)', [req.body.name, req.body.nit], (err, rows, fields) => {
            if (err) {
                return res.send(err);
            }
            return res.redirect('/');
        });
    } else {
        res.redirect('/login');
    }
});

app.get('/api/normas', (req, res) => {
    if (req.isAuthenticated()) {
        connection.query('SELECT * FROM normas', (err, rows, fields) => {
            if (err) {
                return res.send(err);
            }
            return res.send(rows);
        });
    } else {
        res.redirect('/login');
    }
});

app.get('/api/empresas', (req, res) => {
    if (req.isAuthenticated()) {
        connection.query('SELECT * FROM empresas', (err, rows, fields) => {
            if (err) {
                return res.send(err);
            }
            return res.send(rows);
        });
    } else {
        res.redirect('/login');
    }
});

app.get('/api/auditorias', (req, res) => {
    if (req.isAuthenticated()) {
        connection.query(`
        SELECT auditorias.ID, e.nombre as 'empresa', n.nombre as 'norma', fecha, u.usuario as 'auditor',
        (SELECT COUNT(id) FROM respuestas WHERE repuesta = 2 AND auditoria_id = auditorias.ID) AS 'si',
        (SELECT COUNT(id) FROM respuestas WHERE repuesta = 1 AND auditoria_id  = auditorias.ID) AS 'no',
        (SELECT COUNT(id) FROM respuestas WHERE repuesta = 0 AND auditoria_id  = auditorias.ID) AS 'n/a'
        FROM auditorias
        INNER JOIN usuarios u on auditorias.auditor_id = u.ID
        INNER JOIN empresas e on auditorias.empresa_id = e.ID
        INNER JOIN normas n on auditorias.norma_id = n.ID;`, (err, rows, fields) => {
            if (err) {
                return res.send(err);
            }
            return res.send(rows);
        });
    } else {
        res.redirect('/login');
    }
});

app.get('/api/auditorias/:id', (req, res) => {
    if (req.isAuthenticated()) {
        connection.query(`
        SELECT *,
        (SELECT usuarios.usuario FROM usuarios WHERE usuarios.id = auditorias.auditor_id ) AS 'auditor',
        (SELECT empresas.nombre FROM empresas WHERE empresas.id = auditorias.empresa_id ) AS 'empresa',
        (SELECT normas.nombre FROM normas WHERE normas.id = auditorias.norma_id ) AS 'norma',
        (SELECT COUNT(id) FROM respuestas WHERE repuesta = 2 AND auditoria_id = auditorias.ID) AS 'si',
        (SELECT COUNT(id) FROM respuestas WHERE repuesta = 1 AND auditoria_id  = auditorias.ID) AS 'no',
        (SELECT COUNT(id) FROM respuestas WHERE repuesta = 0 AND auditoria_id  = auditorias.ID) AS 'na'
        FROM auditorias WHERE ID = ?`, [req.params.id], (err, rows, fields) => {
            if (err) {
                return res.send(err);
            }
            return res.send(rows);
        });
    } else {
        res.redirect('/login');
    }
});

app.get('/api/hector-the-nigger/:id', (req, res) => {
    if (req.isAuthenticated()) {
        connection.query(`
        `, [req.params.id], (err, rows, fields) => {
            if (err) {
                return res.send(err);
            }
            return res.send(rows);
        });
    } else {
        res.redirect('/login');
    }
});


app.get('/normas', (req, res) => {
    if (req.isAuthenticated()) {
        res.sendFile(path.join(__dirname, "views/rule/rule.html"));
    } else {
        res.redirect('/login');
    }
});

app.post('/normas', (req, res) => {
    if (req.isAuthenticated()) {
        connection.query('INSERT INTO normas (nombre) VALUES (?)', [req.body.name], (err, rows, fields) => {
            if (err) {
                return res.send(err);
            }
            return res.redirect('/');
        });
    } else {
        res.redirect('/login');
    }
});

app.get('/auditorias', (req, res) => {
    if (req.isAuthenticated()) {
        res.sendFile(path.join(__dirname, "views/audit/audit.html"));
    } else {
        res.redirect('/login');
    }
});

app.get('/resultados', (req, res) => {
    if (req.isAuthenticated()) {
        res.sendFile(path.join(__dirname, "views/results/results.html"));
    } else {
        res.redirect('/login');
    }
});

app.get('/api/preguntas', (req, res) => {
    if (req.isAuthenticated()) {
        console.log(req);
        connection.query('SELECT * FROM preguntas WHERE norma_id = ?', [req.query.id], (err, rows, fields) => {
            if (err) {
                return res.send(err);
            }
            return res.send(rows);
        });
    } else {
        res.redirect('/login');
    }
});

app.post('/auditorias', (req, res) => {
    if (req.isAuthenticated()) {
        connection.query('INSERT INTO auditorias (empresa_id, norma_id, fecha, auditor_id, objetivo, auditado) VALUES (?, ?, ?, ?, ?, ?)', [req.body.company, req.body.rule, new Date(), req.session.passport.user, req.body.objective, req.body.audited], (err, rows, fields) => {
            if (err) {
                return res.send(err);
            } else {
                if(Array.isArray(req.body.preguntas)) {
                    req.body.preguntas.forEach(element => {
                        connection.query('INSERT INTO respuestas (auditoria_id, pregunta_id, repuesta) VALUES (?, ?, ?)', [rows.insertId, element.split('-')[0], element.split('-')[1], req.session.passport.user], (err1, rows1, fields1) => {
                            
                            return null;
    
                        });
                    });
                } else {
                    connection.query('INSERT INTO respuestas (auditoria_id, pregunta_id, repuesta) VALUES (?, ?, ?)', [rows.insertId, req.body.preguntas.split('-')[0], req.body.preguntas.split('-')[1], req.session.passport.user], (err1, rows1, fields1) => {
                            
                        return null;

                    });
                }
                
                return res.redirect('/resultados?auditoria=' + rows.insertId);
            }

        });

    } else {
        res.redirect('/login');
    }
});

// Start app
app.listen(3000, () => {
    console.log(`Listening on port 3000`);
});