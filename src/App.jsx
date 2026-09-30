import { useState, useCallback, useMemo, memo } from 'react';
import { FixedSizeList as List } from 'react-window';
import './App.css';

function generateProducts() {
  const items = [];
  for (let i = 1; i <= 5000; i++) {
    items.push({
      id: i,
      name: `Produk Item #${i}`,
      stock: Math.floor(Math.random() * 50) + 1,
      status: 'In Stock',
    });
  }
  return items;
}

// Fungsi komparasi kustom:
// Hanya re-render baris ini JIKA data spesifik di index ini yang berubah
const areRowsEqual = (prevProps, nextProps) => {
  return (
    prevProps.index === nextProps.index &&
    prevProps.style === nextProps.style &&
    prevProps.data.onUpdateStock === nextProps.data.onUpdateStock &&
    prevProps.data.products[prevProps.index] === nextProps.data.products[nextProps.index]
  );
};

// Pasang areRowsEqual sebagai argumen kedua di React.memo
const ProductRow = memo(({ index, style, data }) => {
  const { products, onUpdateStock } = data;
  const product = products[index];

  // console.log ini buat ngebuktiin cuma 1 baris yang re-render
  console.log(`Render baris #${product.id}`);

  return (
    <div style={style} className="product-row">
      <span className="col-id">#{product.id}</span>
      <span className="col-name">{product.name}</span>
      <span className="col-stock">Stok: {product.stock}</span>
      <span className="col-status">{product.status}</span>
      <button
        className="btn-update"
        onClick={() => onUpdateStock(product.id)}
      >
        Kurangi Stok (-1)
      </button>
    </div>
  );
}, areRowsEqual);

export default function App() {
  const [products, setProducts] = useState(generateProducts);

  const handleUpdateStock = useCallback((id) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const newStock = Math.max(0, item.stock - 1);
        return {
          ...item,
          stock: newStock,
          status: newStock === 0 ? 'Out of Stock' : 'In Stock',
        };
      })
    );
  }, []);

  const itemData = useMemo(() => ({
    products,
    onUpdateStock: handleUpdateStock,
  }), [products, handleUpdateStock]);

  return (
    <div className="container">
      <h2>Dashboard Produk</h2>

      <div className="table-header">
        <span className="col-id">ID</span>
        <span className="col-name">Nama Produk</span>
        <span className="col-stock">Stok</span>
        <span className="col-status">Status</span>
        <span className="col-action">Aksi</span>
      </div>

      <List
        height={400}
        itemCount={products.length}
        itemSize={45}
        width="100%"
        itemData={itemData}
      >
        {ProductRow}
      </List>
    </div>
  );
}