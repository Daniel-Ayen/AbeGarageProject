

// // src/markup/pages/admin/ServicesManage.js
// import React, { useState, useEffect } from 'react';
// import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu';
// import { useAuth } from '../../../Contexts/AuthContext';
// import { getAllServices, createService, updateService, deleteService } from '../../../services/service.service';

// function ServicesManage() {
//   const [services, setServices] = useState([]);
//   const [newServiceName, setNewServiceName] = useState('');
//   const [newServiceDesc, setNewServiceDesc] = useState('');
//   const [editingId, setEditingId] = useState(null);
//   const [editingName, setEditingName] = useState('');
//   const [editingDesc, setEditingDesc] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const { isAdmin } = useAuth();

//   const fetchServices = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       const data = await getAllServices();
//       setServices(data || []);
//     } catch (err) {
//       setError(err.message || 'Failed to fetch services');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchServices();
//   }, []);

//   const handleCreate = async (e) => {
//     e.preventDefault();
//     if (!newServiceName.trim()) {
//       setError('Service name cannot be empty');
//       return;
//     }

//     setActionLoading(true);
//     setError('');

//     try {
//       await createService({ 
//         service_name: newServiceName, 
//         service_description: newServiceDesc 
//       });
//       setNewServiceName('');
//       setNewServiceDesc('');
//       setSuccess('Service created successfully');
//       fetchServices();
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       setError(err.message || 'Failed to create service');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     if (!editingName.trim()) {
//       setError('Service name cannot be empty');
//       return;
//     }

//     setActionLoading(true);
//     setError('');

//     try {
//       await updateService(editingId, { 
//         service_name: editingName, 
//         service_description: editingDesc 
//       });
//       setEditingId(null);
//       setEditingName('');
//       setEditingDesc('');
//       setSuccess('Service updated successfully');
//       fetchServices();
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       setError(err.message || 'Failed to update service');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleDelete = async (id, serviceName) => {
//     if (!window.confirm(`Are you sure you want to delete "${serviceName}"? This may affect existing orders.`)) {
//       return;
//     }

//     try {
//       await deleteService(id);
//       setSuccess('Service deleted successfully');
//       fetchServices();
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       setError(err.message || 'Failed to delete service. It may be associated with existing orders.');
//     }
//   };

//   const startEditing = (service) => {
//     setEditingId(service.service_id);
//     setEditingName(service.service_name);
//     setEditingDesc(service.service_description || '');
//   };

//   const cancelEditing = () => {
//     setEditingId(null);
//     setEditingName('');
//     setEditingDesc('');
//   };

//   if (!isAdmin) {
//     return (
//       <div className="container-fluid admin-pages">
//         <div className="row">
//           <div className="col-md-3">
//             <AdminMenu />
//           </div>
//           <div className="col-md-9">
//             <div className="alert alert-danger">
//               You are not authorized to access this page. Admin access required.
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container-fluid admin-pages">
//       <div className="row">
//         <div className="col-md-3 admin-left-side">
//           <AdminMenu />
//         </div>
//         <div className="col-md-9 admin-right-side">
//           <h2>Services Management</h2>

//           {error && (
//             <div className="alert alert-danger alert-dismissible fade show" role="alert">
//               {error}
//               <button type="button" className="btn-close" onClick={() => setError('')}></button>
//             </div>
//           )}

//           {success && (
//             <div className="alert alert-success alert-dismissible fade show" role="alert">
//               {success}
//               <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
//             </div>
//           )}

//           {/* Add New Service Form */}
//           <div className="card mb-4">
//             <div className="card-header">
//               <h5 className="mb-0">Add New Service</h5>
//             </div>
//             <div className="card-body">
//               <form onSubmit={handleCreate}>
//                 <div className="row">
//                   <div className="col-md-8">
//                     <div className="mb-3">
//                       <label className="form-label">Service Name *</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         value={newServiceName}
//                         onChange={(e) => setNewServiceName(e.target.value)}
//                         placeholder="e.g., Oil Change, Brake Service"
//                         disabled={actionLoading}
//                         required
//                       />
//                     </div>
//                   </div>
//                   <div className="col-md-4">
//                     <div className="mb-3">
//                       <label className="form-label">&nbsp;</label>
//                       <button
//                         type="submit"
//                         className="btn btn-success w-100"
//                         disabled={actionLoading || !newServiceName.trim()}
//                       >
//                         {actionLoading ? (
//                           <>
//                             <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                             Adding...
//                           </>
//                         ) : (
//                           'Add Service'
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Description (Optional)</label>
//                   <textarea
//                     className="form-control"
//                     rows="2"
//                     value={newServiceDesc}
//                     onChange={(e) => setNewServiceDesc(e.target.value)}
//                     placeholder="Describe this service..."
//                     disabled={actionLoading}
//                   />
//                 </div>
//               </form>
//             </div>
//           </div>

//           {/* Services List */}
//           <div className="card">
//             <div className="card-header">
//               <h5 className="mb-0">Existing Services ({services.length})</h5>
//             </div>
//             <div className="card-body">
//               {loading ? (
//                 <div className="text-center py-3">
//                   <div className="spinner-border text-primary" role="status">
//                     <span className="visually-hidden">Loading...</span>
//                   </div>
//                   <p className="mt-2">Loading services...</p>
//                 </div>
//               ) : services.length === 0 ? (
//                 <div className="text-center py-4">
//                   <p className="text-muted">No services found. Add your first service above.</p>
//                 </div>
//               ) : (
//                 <div className="list-group">
//                   {services.map(service => (
//                     <div key={service.service_id} className="list-group-item">
//                       {editingId === service.service_id ? (
//                         // Edit Mode
//                         <form onSubmit={handleUpdate}>
//                           <div className="row">
//                             <div className="col-md-5">
//                               <div className="mb-2">
//                                 <input
//                                   type="text"
//                                   className="form-control form-control-sm"
//                                   value={editingName}
//                                   onChange={(e) => setEditingName(e.target.value)}
//                                   required
//                                   disabled={actionLoading}
//                                 />
//                               </div>
//                             </div>
//                             <div className="col-md-5">
//                               <div className="mb-2">
//                                 <textarea
//                                   className="form-control form-control-sm"
//                                   rows="1"
//                                   value={editingDesc}
//                                   onChange={(e) => setEditingDesc(e.target.value)}
//                                   placeholder="Description (optional)"
//                                   disabled={actionLoading}
//                                 />
//                               </div>
//                             </div>
//                             <div className="col-md-2">
//                               <div className="d-flex gap-1">
//                                 <button
//                                   type="submit"
//                                   className="btn btn-success btn-sm"
//                                   disabled={actionLoading || !editingName.trim()}
//                                 >
//                                   Save
//                                 </button>
//                                 <button
//                                   type="button"
//                                   className="btn btn-secondary btn-sm"
//                                   onClick={cancelEditing}
//                                   disabled={actionLoading}
//                                 >
//                                   Cancel
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         </form>
//                       ) : (
//                         // View Mode
//                         <div className="d-flex justify-content-between align-items-center">
//                           <div className="flex-grow-1">
//                             <h6 className="mb-1">{service.service_name}</h6>
//                             {service.service_description && (
//                               <p className="mb-1 text-muted small">{service.service_description}</p>
//                             )}
//                           </div>
//                           <div className="d-flex gap-1">
//                             <button
//                               onClick={() => startEditing(service)}
//                               className="btn btn-outline-primary btn-sm"
//                             >
//                               Edit
//                             </button>
//                             <button
//                               onClick={() => handleDelete(service.service_id, service.service_name)}
//                               className="btn btn-outline-danger btn-sm"
//                             >
//                               Delete
//                             </button>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ServicesManage;


import React, { useState, useEffect } from 'react';
import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu'; // Corrected path
import * as commonService from '../../../services/common.service'; // Corrected import

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
      const data = await commonService.getAllServices();
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
      await commonService.createService({ service_name: newServiceName, service_description: newServiceDesc });
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
      await commonService.updateService(editingId, { service_name: editingName, service_description: editingDesc });
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
        await commonService.deleteService(id);
        fetchServices();
      } catch (err) {
        setError(err.message || 'Failed to delete service.');
      }
    }
  };

  return (
    <section className="contact-section">
      <div className="auto-container">
        <h2 className="contact-title">Manage Services</h2>
        {error && <div className="alert alert-danger" onClick={() => setError('')}>{error}</div>}

        {/* Add New Service Form */}
        <div className="card mb-4 shadow-sm">
          <div className="card-header"><h5>Add a new service</h5></div>
          <div className="card-body">
            <form onSubmit={handleCreate} className="contact-form">
              <div className="form-group">
                <label>Service Name</label>
                <input type="text" className="form-control" value={newServiceName} onChange={(e) => setNewServiceName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Service Description</label>
                <textarea className="form-control" rows="2" value={newServiceDesc} onChange={(e) => setNewServiceDesc(e.target.value)}></textarea>
              </div>
              <button type="submit" className="theme-btn btn-style-one">ADD SERVICE</button>
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
                <form onSubmit={handleUpdate} className="contact-form">
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
    </section>
  );
}

// Wrapper Page
function ServicesManagePage() {
  return (
    <div className="container-fluid admin-pages content-inner">
      <div className="row">
        <div className="col-md-3 admin-left-side">
          <AdminMenu />
        </div>
        <div className="col-md-9 admin-right-side">
          <ServicesManage />
        </div>
      </div>
    </div>
  );
}

export default ServicesManagePage;

