require('dotenv').config(); 

const express = require('express'); 

const connectDB = require('./config/db'); 

const app = express(); 

app.use(express.json());

connectDB(); 

const productRoutes =
require('./routes/productRoutes');

const categoryRoutes =
require('./routes/categoryRoutes');

const userRoutes =
require('./routes/userRoutes');

const errorHandler =
require('./middleware/errorHandler');

app.get('/', (req, res) => res.send('API Ecommerce en marxa')); 

app.use('/api/products', productRoutes);

app.use('/api/categories', categoryRoutes);

app.use('/api/users', userRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000; 

app.listen(PORT, () => console.log(`Servidor escoltant al port ${PORT}`)); 
