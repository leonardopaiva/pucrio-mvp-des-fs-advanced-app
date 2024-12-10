// src/components/LayoutAdmin.js
import { Link, Outlet } from 'react-router-dom';

/*
  This isnt the main layout, is just a dummy layout to demonstrate how the admin
  template could be diferent than the main app template.

  Layouts are a way to change the app's template, including its header, 
  footer, and other structural elements. They are useful in apps that have 
  both a logged-in user area and a landing page area with different structures.
  In this app, it wasn't very necessary, but it was a way to make the app scalable.
*/
function AdminLayout() {
  return (
    <div style={{ display: 'flex' }}>
      <aside style={{ width: '200px', backgroundColor: '#f4f4f4', padding: '20px' }}>
        <h3>Admin Menu</h3>
        <ul>
          <li><Link to="/admin/dashboard">Dashboard</Link></li>
          <li><Link to="/admin/settings">Settings</Link></li>
          <li><Link to="/">back to home</Link></li>
        </ul>
      </aside>
      
      <main style={{ padding: '20px', flex: 1 }}>
        <h1>Admin Area</h1>
        <Outlet /> {/* Aqui será renderizado o conteúdo da área administrativa */}
      </main>
    </div>
  );
}

export default AdminLayout;