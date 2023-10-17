import 'pg'
import { db } from './db';


const products = process.env.PRODUCTS_DB_NAME;
const stocks = process.env.STOCKS_DB_NAME;


async function createTables() {
  try {
    await db.schema.createTable(products, (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
    });

    await db.schema.createTable(stocks, (table) => {
      table.increments('id').primary();
      table.integer('product_id').unsigned().notNullable();
      table.foreign('product_id').references('products.id');
      table.integer('count').notNullable();
    });

    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables', error);
  } finally {
    await db.destroy();
  }
}

createTables();
