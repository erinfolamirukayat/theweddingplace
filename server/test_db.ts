import { pool } from './src/index';
async function test() {
  try {
    const res = await pool.query('SELECT * FROM registries WHERE uuid = $1', ['2ecee97e-bfab-4a2f-ae1b-f1eb4d1e4dca']);
    console.log(res.rows);
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
test();
