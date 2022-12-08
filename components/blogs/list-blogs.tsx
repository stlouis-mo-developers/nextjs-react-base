// ListBlogs Component for fetching & listing all items

// Import Modules
import React, { useState, useEffect, useCallback } from 'react';
import { AUTH_KEY } from '../../services/constants';
import { BaseUrlTypes, HttpRequestTypes, utils } from '../../services/utility';
import BlogForm from './blog-form';
import AddBlog from './add-blog';
import BlogDetail from './blog-detail';
import { EmptyGallery } from '../../models/gallery';

const API_FORM_URL = utils.getBaseApi(BaseUrlTypes.Gallery);
const editmodes = { edit: false, detail: false, delete: false };

// List Blogs Component
const ListBlogs = () => {
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState({ ...editmodes });
  const [itemDetail, setItemDetail] = useState({ ...EmptyGallery });
  const [displayAddForm, setAddForm] = useState(false);
  const [userAuth, setUserAuth] = useState({ IsAdmin: false });

  const getUserAuth = () => {
    const userAuthResult = utils.getUserAuthRoles(AUTH_KEY);
    setUserAuth({ ...userAuthResult });
  };

  const getBlogDetail = (item: any) => {
    const result = fetchBlog(item.ITCC_ImageID, HttpRequestTypes.GET);
    result.then((response) => {
      const result = response.json();
      if (result) {
        result.then(
          (result: any) => {
            setItemDetail(result);
          },
          (error: any) => {
            return error;
          }
        );
      }
    });
  };

  const handleAddBlogClick = () => {
    setAddForm(true);
  };

  const handleEditBlog = (item: any) => {
    setEditItem({ ...editmodes, edit: true });
    getBlogDetail(item);
  };

  const handleDeleteBlog = (item: any) => {
    setEditItem({ ...editmodes, delete: true });
    getBlogDetail(item);
  };

  const handleBlogDetail = (item: any) => {
    setEditItem({ ...editmodes, detail: true });
    getBlogDetail(item);
  };

  const onCancelBlogDetail = () => {
    setEditItem({ ...editmodes });
    setItemDetail({ ...EmptyGallery });
  };
  const onConfirmDelete = (value: any) => {
    setEditItem({ ...editmodes });
    setItemDetail({ ...EmptyGallery });
    const result = fetchBlog(value, HttpRequestTypes.DELETE);
    result.then((response) => {
      const result = response.json();
      fetchBlogs().then();
      return result;
    });
  };

  const onSaveAddBlog = () => {
    fetchBlogs().then(() => { console.log('onSaveAddBlog > fetch Blogs') });
    setAddForm(false);
  };

  const onCancelAddBlog = () => {
    setAddForm(false);
  };

  const onChangeEditBlog = (e: any) => {
    const key: any = e.target.name;
    const value: any = e.target.value;
    const formState: any = { ...itemDetail, [key]: value };

    setItemDetail(formState);
  };

  const onCancelEditBlog = () => {
    setEditItem({ ...editmodes });
    setItemDetail({ ...EmptyGallery });
  };

  const onSaveEditBlog = () => {
    postFormRequest(itemDetail);
    fetchBlogs().then(() => { console.log('onSaveEditBlog > fetch Blogs') });
    setItemDetail({ ...EmptyGallery });
    setAddForm(false);
  };

  const onChangeImageHandle = (event: any) => {
    const file = event.target.files[0];
    const fileName = file.name || 'image.png';
    const fileSize = file.size / 1024;

    if ((fileSize * 1024) > 100000) {
      return;
    }
    const formData = new FormData();

    formData.append('file', file, fileName);
    Object.entries(itemDetail).forEach(([key, value]) => {
      const item: any = value || '';
      formData.append(key, item);
    });

    //console.log({formData: Array.from(formData.entries()), file: file, filename: fileName, fileSize: fileSize})
  }

  const postFormRequest = (formData: any) => {
    const headers = {
      'Content-Type': 'application/json',
      ...utils.getUserAuthHeader(AUTH_KEY),
    };

    const url = API_FORM_URL + '/' + formData.ITCC_ImageID;
    return fetch(url, {
      method: 'PUT',
      body: JSON.stringify(formData),
      headers: headers,
    }).then((response) => response.json());
  };

  const fetchBlogs = useCallback(async () => {
    const headers = {
      'Content-Type': 'application/json',
      ...utils.getUserAuthHeader(AUTH_KEY),
    };

    fetch(API_FORM_URL, {
      method: 'GET',
      headers: headers,
      credentials: 'include',
    }).then((response) => {
      const result = response.json();
      if (result) {
        result.then(
          (result: any) => {
            setItems(result);
          },
          (error: any) => {
            return error;
            //console.log(error);
          }
        );
      }
    });
  }, []);

  const fetchBlog = (id: number, method: HttpRequestTypes) => {
    const url = API_FORM_URL + '/' + id;
    const headers = {
      'Content-Type': 'application/json',
      ...utils.getUserAuthHeader(AUTH_KEY),
    };

    return fetch(url, {
      method: method,
      headers: headers,
      credentials: 'include',
    });
  };

  useEffect(() => {
    getUserAuth();
    fetchBlogs();
  }, [fetchBlogs]);

  return (
    <div className="align-items-center justify-content-center mt-5 mb-5 clearfix">
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-8">
          {/* <!-- BEGIN - ADD USER BUTTON  --> */}

          {!displayAddForm && itemDetail.ITCC_ImageID === 0 && (
            <div className="d-grid mt-1">
              <button
                onClick={() => handleAddBlogClick()}
                className="btn btn-info"
                type="button"
                value="Edit"
              >
                <i className="bi bi-person-plus"></i> &nbsp;Add Blog
              </button>
            </div>
          )}

          {/* <!-- END - ADD USER BUTTON  --> */}

          {/* <!-- BEGIN ADD USER  --> */}
          {displayAddForm && (
            <AddBlog
              onSaveAddBlog={onSaveAddBlog}
              onCancelAddBlog={onCancelAddBlog}
            ></AddBlog>
          )}
          {/* <!-- END ADD USER  --> */}

          {/* <!-- BEGIN EDIT USER  --> */}
          {(editItem.edit && itemDetail.ITCC_ImageID) > 0 && (
            <section className="card py-1 mt-1">
              <BlogForm
                {...itemDetail}
                title="Edit Blog"
                onChange={onChangeEditBlog}
                onCancel={onCancelEditBlog}
                onClick={onSaveEditBlog}
                onChangeImageHandle={onChangeImageHandle}
              >
                <i className="bi bi-sticky"> &nbsp; </i>Save
              </BlogForm>
            </section>
          )}
          {/* <!-- END EDIT USER  --> */}

          {/* <!-- BEGIN USER DETAIL  --> */}
          {(editItem.detail && itemDetail.ITCC_ImageID) > 0 && (
            <section className="card py-1 mt-1">
              <BlogDetail
                {...itemDetail}
                {...editItem}
                title="Blog Details"
                onCancel={onCancelBlogDetail}
              ></BlogDetail>
            </section>
          )}
          {/* <!-- END USER DETAIL --> */}

          {/* <!-- BEGIN USER DETAIL  --> */}
          {(editItem.delete && itemDetail.ITCC_ImageID) > 0 && (
            <section className="card py-1 mt-1">
              <BlogDetail
                {...itemDetail}
                {...editItem}
                title="Delete Blog"
                onCancel={onCancelBlogDetail}
                onConfirmDelete={onConfirmDelete}
              ></BlogDetail>
            </section>
          )}
          {/* <!-- END USER DETAIL --> */}

          {/* <!-- BEGIN LIST USERS  --> */}

          {itemDetail.ITCC_ImageID === 0 && (
            <section className="card py-1 mt-2">
              <h3 className="card-title text-center text-dark mt-3">
                <i className="bi bi-people"></i> Blogs
              </h3>

              <div className="card-body">
                {items.map((item: any, index: number) => {
                  return (
                    <section key={index}>
                      <div className="row">
                        <div className="col-md-2">
                          <div className="d-grid mt-3">
                            <button
                              onClick={() => handleBlogDetail(item)}
                              className="btn btn-outline-dark btn-sm"
                              type="button"
                              value="Detail"
                            >
                              <i className="bi bi bi-ticket-detailed"></i>{' '}
                              &nbsp;
                            </button>
                            <button
                              onClick={() => handleEditBlog(item)}
                              disabled={!userAuth.IsAdmin}
                              className="btn btn-outline-warning btn-sm"
                              type="button"
                              value="Edit"
                            >
                              <i className="bi bi-pencil-square"></i> &nbsp;
                            </button>
                            <button
                              onClick={() => handleDeleteBlog(item)}
                              disabled={!userAuth.IsAdmin}
                              className="btn btn-outline-danger btn-sm"
                              type="button"
                              value="Delete"
                            >
                              <i className="bi bi-trash3"></i> &nbsp;
                            </button>
                          </div>
                        </div>

                        <div className="col-md-5">
                          <p className="text-dark">{item.Name}</p>
                        </div>

                        <div className="col-md-5">
                          {item.FilePath && <div>
                            <img alt="image" className="img-fluid" src={item.FilePath} />
                          </div>
                          }
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <a
                            href={item.PublishUrl}
                            className="text-primary"
                            rel="noreferrer"
                            target="_blank"
                          >
                            {item.PublishUrl}
                          </a>
                          <p className="text-dark">{item.Description}</p>
                        </div>
                      </div>
                      <hr className="pt-1 bg-info" />
                    </section>
                  )
                })}
              </div>
            </section>
          )}

          {/* <!-- END LIST USERS  --> */}
        </div>
        <div className="col-md-2"></div>
      </div>
    </div>
  );
};

export default ListBlogs;