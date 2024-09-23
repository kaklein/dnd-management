function AboutFooter() {
  return (
    <footer className="footer bg-dark about-footer">
        <div className="container container-fluid text-center">
          <div className="justify-content-center border-bottom pb-3 mb-3">
            <div className="row">
              <div className="col-3"/>
              <div className="col-3">
                <a href="/home">Home</a>
              </div>
              <div className="col-3">
                <a href="/about">About</a>
              </div>
              <div className="col-3"/>
            </div>
            
          </div>
          <p className="center"><i>{new Date().getFullYear()}</i></p>
        </div>
    </footer>
  )
}

export default AboutFooter;