import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';


const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('home', { listaDeProductos: listaDeProductos });
});

app.get('/realTimeProducts', (req, res) => {
    res.render('realTimeProducts');
});

let listaDeProductos = [];

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.emit('productos', listaDeProductos);

    socket.on('crearProducto', (nuevoProducto) => {
        listaDeProductos.push(nuevoProducto);
        io.emit('productos', listaDeProductos);
    });

    socket.on('eliminarProducto', (idProducto) => {
        listaDeProductos = listaDeProductos.filter(producto => producto.id !== idProducto);
        io.emit('productos', listaDeProductos);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
