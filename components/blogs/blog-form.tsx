import React from 'react';

const BlogForm = (props: any) => {
  const handleTextAreaAutogrow = (e: any) => {
    // Reset field height
    e.target.style.height = 'inherit';

    // Get the computed styles for the element
    const computed = window.getComputedStyle(e.target);

    // Calculate the height
    const height =
      parseInt(computed.getPropertyValue('border-top-width'), 10) +
      parseInt(computed.getPropertyValue('padding-top'), 10) +
      e.target.scrollHeight +
      parseInt(computed.getPropertyValue('padding-bottom'), 10) +
      parseInt(computed.getPropertyValue('border-bottom-width'), 10);

    e.target.style.height = `${height}px`;
  };

  return (
    <>
      <section className="py-1 mt-1" key="user-form">
        {/* <!-- BEGIN FORM  -->} */}

        <section className="card">
          <h3 className="card-title text-center text-dark mt-3">
          <i className="bi bi-envelope-dash-fill"></i> {props.title}
          </h3>

          <form className="card-body">
            <div className="row">
              <div className="col-md-12">
                <label htmlFor="Name">Name</label>
                <input
                  value={props.Name || ''}
                  onChange={props.onChange}
                  className="form-control"
                  id="Name"
                  name="Name"
                  placeholder="Name ..."
                  type="text"
                  autoComplete="false"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <label htmlFor="Name">Slug</label>
                <input
                  value={props.Slug || ''}
                  onChange={props.onChange}
                  className="form-control"
                  id="Slug"
                  name="Slug"
                  placeholder="Slug ..."
                  type="text"
                  autoComplete="false"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <label htmlFor="Description"> Description</label>
                <textarea
                  onKeyUp={handleTextAreaAutogrow}
                  rows={3}
                  value={props.Description || ''}
                  onChange={props.onChange}
                  className="form-control"
                  id="Description"
                  name="Description"
                  placeholder="Description ..."
                  autoComplete="false"
                ></textarea>
              </div>
            </div>

            <div className="row">

              <div className="col-md-6">
                <label htmlFor="BlogType">BlogType</label>
                <input
                  value={props.BlogType || ''}
                  onChange={props.onChange}
                  className="form-control"
                  id="BlogType"
                  name="BlogType"
                  placeholder="BlogType ..."
                  type="text"
                  autoComplete="false"
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="FilePath"> Category</label>
                <input
                  value={props.Category || ''}
                  onChange={props.onChange}
                  className="form-control"
                  id="Category"
                  name="Category"
                  placeholder="Category ..."
                  type="text"
                  autoComplete="false"
                />
              </div>


            </div>

            <div className="row">
              <div className="col-md-12">
                <label htmlFor="ImageUrl"> ImageUrl</label>
                <input
                  value={props.ImageUrl || ''}
                  onChange={props.onChange}
                  className="form-control"
                  id="ImageUrl"
                  name="ImageUrl"
                  placeholder="ImageUrl ..."
                  type="text"
                  autoComplete="false"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <div className="d-grid mt-2">
                  <button
                    onClick={props.onClick}
                    className="btn btn-primary btn-block"
                    type="button"
                    value="Create"
                  >
                    <i className="bi bi-user"></i> &nbsp;{props.children}
                  </button>
                </div>
              </div>
              <div className="col-6">
                <div className="d-grid mt-2">
                  <button
                    onClick={props.onCancel}
                    className="btn btn-secondary btn-block"
                    type="button"
                    value="Cancel"
                  >
                    <i className="bi bi-x-octagon"></i> &nbsp;Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        </section>

        {/* <!-- END FORM  -->} */}
      </section>
    </>
  );
};

export default BlogForm;
