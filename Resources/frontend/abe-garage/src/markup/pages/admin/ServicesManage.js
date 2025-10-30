import React, { useState, useEffect } from 'react';
import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu';
import { getAllServices, createService, updateService, deleteService } from '../../../services/common.service';

function ServicesManage() {
  const [services, setServices] = useState([]);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [editingId, setEditingId] = useState(null); // The ID of the service being edited
  const [editingName, setEditingName] = useState('');
  const [editingDesc, setEditingDesc] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllServices();
      setServices(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newServiceName.trim()) {
      setError('Service name cannot be empty.');
      return;
    }
    setError('');
    try {
      await createService({ service_name: newServiceName, service_description: newServiceDesc });
      setNewServiceName('');
      setNewServiceDesc('');
      fetchServices();
    } catch (err) {
      setError(err.message || 'Failed to add service. It may already exist.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingName.trim()) {
      setError('Service name cannot be empty.');
      return;
    }
    setError('');
    try {
      await updateService(editingId, { service_name: editingName, service_description: editingDesc });
      setEditingId(null);
      setEditingName('');
      setEditingDesc('');
      fetchServices();
    } catch (err) {
      setError(err.message || 'Failed to update service.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('WARNING: Deleting a service is not recommended. It may be associated with existing orders.')) {
      try {
        await deleteService(id);
        fetchServices();
      } catch (err) {
        setError(err.message || 'Failed to delete service.');
      }
    }
  };

  return (
    <div className="container content-inner">
      <div className="row">
        <AdminMenu />
        <div className="col-md-9">
          <h2>Manage Services</h2>
          {error && <div className="alert alert-danger" onClick={() => setError('')}>{error}</div>}

          {/* Add New Service Form */}
          <div className="card mb-4 shadow-sm">
            <div className="card-header"><h5>Add a new service</h5></div>
            <div className="card-body">
              <form onSubmit={handleCreate}>
                <div className="form-group">
                  <label>Service Name</label>
                  <input type="text" className="form-control" value={newServiceName} onChange={(e) => setNewServiceName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Service Description</label>
                  <textarea className="form-control" rows="2" value={newServiceDesc} onChange={(e) => setNewServiceDesc(e.target.value)}></textarea>
                </div>
                <button type="submit" className="btn btn-success">ADD SERVICE</button>
              </form>
            </div>
          </div>

          {/* Services List */}
          <h5>Existing Services</h5>
          {loading && <p>Loading services...</p>}
          <ul className="list-group">
            {services.map(service => (
              <li key={service.service_id} className="list-group-item">
                {editingId === service.service_id ? (
                  // Edit Form (inline)
                  <form onSubmit={handleUpdate}>
                    <input type="text" className="form-control mb-2" value={editingName} onChange={(e) => setEditingName(e.target.value)} required />
                    <textarea className="form-control mb-2" rows="2" value={editingDesc} onChange={(e) => setEditingDesc(e.target.value)}></textarea>
                    <button type="submit" className="btn btn-sm btn-success mr-2">Save</button>
                    <button type="button" onClick={() => setEditingId(null)} className="btn btn-sm btn-secondary">Cancel</button>
                  </form>
                ) : (
                  // Display Row
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{service.service_name}</strong>
                      <p className="mb-0"><small>{service.service_description}</small></p>
                    </div>
                    <div>
                      <button onClick={() => { setEditingId(service.service_id); setEditingName(service.service_name); setEditingDesc(service.service_description || ''); }} className="btn btn-sm btn-info mr-2" title="Edit">
                        <i className="fa fa-pencil"></i>
                      </button>
                      <button onClick={() => handleDelete(service.service_id)} className="btn btn-sm btn-danger" title="Delete">
                        <i className="fa fa-trash"></i>
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ServicesManage;
