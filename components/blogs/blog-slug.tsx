// Blog Slug Component for viewing a Blog 

// Blogs Home Component
const BlogSlug = (props: any) => {
  const item = props.data;

  return (
    <div className="align-items-center justify-content-center mt-5 mb-5 clearfix">

      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-8">

          {/* <!-- BEGIN BLOG SLUG  --> */}
          <section className="card py-3 px-3 ">

            <h1 className="card-title text-center textdark mt-3">
              <i className="bi bi-people"></i> {item.Name}
            </h1>

            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: item.Description,
                    }}
                  ></div>
                </div>
              </div>
              <div className="row"><div className="col-md-12"><hr className="pt-1 bg-info" />
              </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="d-flex justify-content-start mb-4">{item.Category}</div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex justify-content-end mb-4">{item.BlogType}</div>
                </div>
              </div>
            </div>

          </section>

          {/* <!-- END BLOG SLUG  --> */}
        </div>
        <div className="col-md-2"></div>
      </div>

    </div>
  );
};

export default BlogSlug;
