import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Firestore from "../js/Firestore";
import Text from "../util/Text";
import Product from "./Product";

let arr = [];
// [
//   [
//     ["pret", ">=", 100],
//     ["pret", "<=", 200],
//   ],
//   [
//     ["pret", ">=", 200],
//     ["pret", "<=", 300],
//   ],
// ];
const firestore = new Firestore();
let filters = [];
let local_filters = [];
const filter_arr = {
  "0-100": [
    ["pret", ">=", 0],
    ["pret", "<=", 100],
  ],
  "100-200": [
    ["pret", ">=", 100],
    ["pret", "<=", 200],
  ],
  "200-300": [
    ["pret", ">=", 200],
    ["pret", "<=", 300],
  ],
  "300-400": [
    ["pret", ">=", 300],
    ["pret", "<=", 400],
  ],
  "400-500": [
    ["pret", ">=", 400],
    ["pret", "<=", 500],
  ],
  "over-500": [["pret", ">=", 500]],
};

function Shop({ addit }) {
  const { categorie, sort_param } = useParams();
  let [products, setProducts] = useState([]);
  const [filter_map, setf] = useState([]);

  // let [catt, setCatt] = useState(["categories", "==", categorie]);
  let catt = ["categories", "==", categorie];

  useEffect(() => {
    setf(Object.entries(filter_arr));
    if (
      localStorage.getItem("local_filters") &&
      localStorage.getItem("local_filters") !== "[]"
    ) {
      local_filters = JSON.parse(localStorage.getItem("local_filters"));
    }
    if (
      localStorage.getItem("filters") &&
      localStorage.getItem("filters") !== "[]"
    ) {
      filters = JSON.parse(localStorage.getItem("filters"));
    }
    console.log(filters);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (categorie == "reducere") catt = ["old_pret", ">", 0];
  }, [catt]);

  useEffect(() => {
    if (categorie == "reducere") catt = ["old_pret", ">", 0];
    if (categorie.includes("search")) {
      //search ========== includes
      firestore
        .readDocuments("products", ["nume", [], categorie])
        .then(async (res) => {
          if (
            localStorage.getItem("filters") !== "[]" &&
            localStorage.getItem("filters")
          ) {
            filters = JSON.parse(localStorage.getItem("filters"));

            res = await updateFilters(res, filters);
          }
          if (sort_param) {
            sort(res, sort_param);
          }
          arr = res;
          setProducts((old) => (old = res));
        });
    } else
      firestore.readDocuments("products", catt).then(async (res) => {
        if (
          localStorage.getItem("filters") !== "[]" &&
          localStorage.getItem("filters")
        ) {
          filters = JSON.parse(localStorage.getItem("filters"));

          res = await updateFilters(res, filters);
        }
        if (sort_param) {
          sort(res, sort_param);
        }
        arr = res;
        setProducts((old) => (old = res));

        // console.log(arr);
      });
  }, [categorie, sort_param]);

  const sort = async (arr, cat, nope) => {
    switch (cat) {
      case "pc":
        // console.log("pc acum");
        arr.sort((a, b) => a.pret - b.pret);
        // setProducts((prod) => [...prod.sort((a, b) => a.pret - b.pret)]);
        break;
      case "pd":
        arr.sort((a, b) => b.pret - a.pret);
        // setProducts((prod) => [...prod.sort((a, b) => b.pret - a.pret)]);
        break;
      case "nc":
        arr.sort((a, b) => a.nume.localeCompare(b.nume));
        // setProducts((prod) => [...prod.sort((a, b) => a.nume - b.nume)]);
        break;
      case "nd":
        arr.sort((a, b) => b.nume.localeCompare(a.nume));
        // setProducts((prod) => [...prod.sort((a, b) => b.nume - a.nume)]);
        break;

      case "rc":
        arr.sort((a, b) => b.rating - a.rating);
        break;
    }
    if (nope !== "ok") setProducts([...arr]);

    // console.log("products", products);
    // console.log("arr", arr);
  };

  // const [filters, setFilters] = useState([
  // ["old_pret", "==", 0],
  /**
   *  [ "brand", "==", "dero" ]
   */
  // ]);
  // useEffect(() => {
  //   console.log(filters);
  // }, filters);

  const updateFilters = async (arr, filters) => {
    await firestore.filter(arr, filters).then((res) => {
      arr = res;
    });
    return arr;
  };

  const addFilter = async (e, id) => {
    const check = e.target.checked;
    console.log(check);

    if (check) {
      console.log("==================ADAUGARE====================");
      filters = [...filters, { [id]: filter_arr[id] }];
      local_filters = [...local_filters, id];
    } else {
      console.log("==================MARS====================");

      filters = filters.filter((f) => !compareArrays(f[id], filter_arr[id]));
      local_filters = local_filters.filter((f) => f !== id);

      localStorage.setItem("filters", JSON.stringify(filters));

      await firestore.readDocuments("products", catt).then(async (res) => {
        if (sort_param) {
          sort(res, sort_param);
        }
        arr = res;
        products = res;
      });
    }
    localStorage.setItem("filters", JSON.stringify(filters));
    localStorage.setItem("local_filters", JSON.stringify(local_filters));

    const rasp = await updateFilters(products, filters);
    if (rasp !== false) {
      console.log("rasp", rasp);
      if (sort_param) {
        sort(rasp, sort_param, "ok");
      }
      setProducts(rasp);
    } else {
      await firestore.readDocuments("products", catt).then(async (res) => {
        if (sort_param) {
          sort(res, sort_param);
        }
        arr = res;
        setProducts((old) => (old = res));
      });
    }
  };
  const compareArrays = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  const isChecked = (id) => {
    if (
      localStorage.getItem("local_filters") !== "[]" &&
      localStorage.getItem("local_filters")
    ) {
      let local_local_filters = JSON.parse(
        localStorage.getItem("local_filters")
      );
      for (let i = 0; i < local_local_filters.length; i++) {
        if (local_local_filters[i] == id) return true;
      }
    }
    return false;
  };

  const reset = async () => {
    document.querySelectorAll("input[type='checkbox']").forEach((input) => {
      input.checked = false;
    });
    filters = [];
    local_filters = [];
    if (localStorage.getItem("local_filters")) {
      localStorage.removeItem("local_filters");
    }

    if (localStorage.getItem("filters")) {
      localStorage.removeItem("filters");
    }
    const rasp = await updateFilters(products, filters);
    if (rasp !== false) {
      if (sort_param) {
        sort(rasp, sort_param, "ok");
      }
      setProducts(rasp);
    } else {
      await firestore.readDocuments("products", catt).then(async (res) => {
        if (sort_param) {
          sort(res, sort_param);
        }
        arr = res;
        setProducts((old) => (old = res));

        // console.log(arr);
      });
    }
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row px-xl-5">
          <div className="col-12">
            <nav className="breadcrumb bg-light mb-30">
              <Link className="breadcrumb-item text-dark" to="/">
                Home
              </Link>
              <span className="breadcrumb-item active">Shop</span>
            </nav>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="row px-xl-5">
          <div className="col-lg-3 col-md-4">
            <h5 className="section-title position-relative text-uppercase mb-3">
              <span className="bg-secondary pr-3">Filter by price</span>
            </h5>
            <button className="btn btn-primary" onClick={reset}>
              Reset all filters
            </button>
            <div className="bg-light p-4 mb-30">
              <div>
                {filter_map.map((filter, index) => {
                  let ar = filter[0].split("-");
                  // console.log(local_filters, index, filter[0]);
                  // if (index == 5) {
                  //   for (let i = 0; i < local_filters.length; i++) {
                  //     let id = local_filters[i];
                  //     console.log(Object.keys(id)[0]);
                  //   }
                  // }

                  return (
                    <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                      <input
                        checked={
                          local_filters.find((id) => id == filter[0])
                            ? true
                            : false
                        }
                        type="checkbox"
                        className="custom-control-input"
                        onChange={(e) => addFilter(e, filter[0])}
                        // data-filter={filter[0]}
                        id={`price-${index}`}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor={`price-${index}`}
                      >
                        {index <= 5 &&
                          (ar[0] === "over" ? "> " : "$" + ar[0] + " - ") +
                            "$" +
                            ar[1]}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            <h5 className="section-title position-relative text-uppercase mb-3">
              <span className="bg-secondary pr-3">Filter by color</span>
            </h5>
            <div className="bg-light p-4 mb-30">
              <form>
                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                  <input
                    type="checkbox"
                    //                    )}
                    className="custom-control-input"
                    id="color-all"
                  />
                  <label className="custom-control-label" htmlFor="price-all">
                    All Color
                  </label>
                </div>
                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                  <input
                    type="checkbox"
                    //                    )}
                    className="custom-control-input"
                    id="color-1"
                  />
                  <label className="custom-control-label" htmlFor="color-1">
                    Black
                  </label>
                </div>
                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                  <input
                    type="checkbox"
                    //                    )}
                    className="custom-control-input"
                    id="color-2"
                  />
                  <label className="custom-control-label" htmlFor="color-2">
                    White
                  </label>
                </div>
                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                  <input
                    type="checkbox"
                    //                    )}
                    className="custom-control-input"
                    id="color-3"
                  />
                  <label className="custom-control-label" htmlFor="color-3">
                    Red
                  </label>
                </div>
                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                  <input
                    type="checkbox"
                    //                    )}
                    className="custom-control-input"
                    id="color-4"
                  />
                  <label className="custom-control-label" htmlFor="color-4">
                    Blue
                  </label>
                </div>
                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between">
                  <input
                    type="checkbox"
                    //                    )}
                    className="custom-control-input"
                    id="color-5"
                  />
                  <label className="custom-control-label" htmlFor="color-5">
                    Green
                  </label>
                </div>
              </form>
            </div>

            <h5 className="section-title position-relative text-uppercase mb-3">
              <span className="bg-secondary pr-3">Filter by size</span>
            </h5>
            <div className="bg-light p-4 mb-30">
              <form>
                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                  <input
                    type="checkbox"
                    //                    )}
                    className="custom-control-input"
                    id="size-all"
                  />
                  <label className="custom-control-label" htmlFor="size-all">
                    All Size
                  </label>
                </div>
                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                  <input
                    type="checkbox"
                    //                    )}
                    className="custom-control-input"
                    id="size-1"
                  />
                  <label className="custom-control-label" htmlFor="size-1">
                    XS
                  </label>
                </div>
                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                  <input
                    type="checkbox"
                    //                    )}
                    className="custom-control-input"
                    id="size-2"
                  />
                  <label className="custom-control-label" htmlFor="size-2">
                    S
                  </label>
                </div>
                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                  <input
                    type="checkbox"
                    //                    )}
                    className="custom-control-input"
                    id="size-3"
                  />
                  <label className="custom-control-label" htmlFor="size-3">
                    M
                  </label>
                </div>
                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                  <input
                    type="checkbox"
                    //                    )}
                    className="custom-control-input"
                    id="size-4"
                  />
                  <label className="custom-control-label" htmlFor="size-4">
                    L
                  </label>
                </div>
                <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between">
                  <input
                    type="checkbox"
                    //                    )}
                    className="custom-control-input"
                    id="size-5"
                  />
                  <label className="custom-control-label" htmlFor="size-5">
                    XL
                  </label>
                </div>
              </form>
            </div>
          </div>

          <div className="col-lg-9 col-md-8">
            <div className="row pb-3 products">
              <div className="col-12 pb-1">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div className="d-flex align-items-center justify-content-between ">
                    <h5>
                      {products && products.length}
                      {" - "}{" "}
                      {products && products.length == 1 ? (
                        <>Produs</>
                      ) : (
                        <>Produse</>
                      )}
                    </h5>
                  </div>
                  <div className="ml-2">
                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn-sm btn-light dropdown-toggle"
                        data-toggle="dropdown"
                      >
                        Sorting
                      </button>
                      <div className="dropdown-menu dropdown-menu-right">
                        <Link
                          to={`/shop/${categorie}/pc`}
                          className="dropdown-item"
                          style={{ cursor: "pointer" }}
                          // onClick={() => sort("pc")}
                        >
                          Pret - crescator
                        </Link>
                        <Link
                          to={`/shop/${categorie}/pd`}
                          className="dropdown-item"
                          style={{ cursor: "pointer" }}
                          // onClick={() => sort("pd")}
                        >
                          Pret - descrescator
                        </Link>
                        <Link
                          to={`/shop/${categorie}/nc`}
                          className="dropdown-item"
                          style={{ cursor: "pointer" }}
                          // onClick={() => sort("nc")}
                        >
                          Nume - crescator
                        </Link>
                        <Link
                          to={`/shop/${categorie}/nd`}
                          className="dropdown-item"
                          style={{ cursor: "pointer" }}
                          // onClick={() => sort("nd")}
                        >
                          Nume - descrescator
                        </Link>

                        <Link
                          to={`/shop/${categorie}/rc`}
                          className="dropdown-item"
                          style={{ cursor: "pointer" }}
                        >
                          Cele mai populare
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {products && products != [] ? (
                products.map((prod) => (
                  <Product
                    key={prod.id}
                    id={prod.id}
                    addit={addit}
                    img={prod.images ? prod.images[0] : ""}
                    link={`/prod/${prod.id}`}
                    name={Text.returnSizedText(prod.nume)}
                    price={prod.pret}
                    oldPrice={prod.old_pret}
                    rating={prod.rating}
                  />
                ))
              ) : (
                <span className="loader"></span>
              )}
            </div>
          </div>
        </div>
      </div>

      <a href="#" className="btn btn-primary back-to-top">
        <i className="fa fa-angle-double-up"></i>
      </a>
    </>
  );
}

export default Shop;
