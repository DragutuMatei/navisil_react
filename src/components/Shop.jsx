import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Firestore from "../js/Firestore";
import Text from "../util/Text";
import Product from "./Product";

let arr = [];
const firestore = new Firestore();
let filters = [];
let local_filters = [];
let filter_arr = {
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
  "is-Discount": [["old_pret", ">", 0]],
  "5-rating": [["rating", "==", 5]],
  "4-rating": [["rating", "==", 4]],
  "3-rating": [["rating", "==", 3]],
  "2-rating": [["rating", "==", 2]],
  "1-rating": [["rating", "==", 1]],
  samsung: [["brand", "==", "samsung"]],
  apple: [["brand", "==", "apple"]],
  xiaomi: [["brand", "==", "xiaomi"]],
  motorola: [["brand", "==", "motorola"]],
};

function Shop({ addit }) {
  const { categorie, sort_param } = useParams();
  let [products, setProducts] = useState([]);
  const [filter_map, setf] = useState([]);

  // let catt = ["categories", "==", categorie];
  let [catt, setCatt] = useState(["categories", "==", categorie]);

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

  // useEffect(() => {
  //   products.map((p) => {
  //     if (p.brand !== undefined) {
  //       filter_arr = {
  //         ...filter_arr,
  //         ...{ [p.brand]: [["brand", "==", p.brand]] },
  //       };
  //     }
  //   });
  //   console.log(filter_arr);
  // }, [products]);

  useEffect(() => {
    if (categorie == "reducere") catt = ["old_pret", ">", 0];
    else catt = ["categories", "==", categorie];
    console.log(catt);
  }, [catt, categorie]);

  useEffect(() => {
    if (categorie == "reducere") {
      catt = ["old_pret", ">", 0];
    } else catt = ["categories", "==", categorie];
    if (categorie.includes("search")) {
      //search ========== includes
      firestore
        .readDocuments("products", ["nume", [], categorie])
        .then(async (res) => {
          if (
            localStorage.getItem("filters") &&
            localStorage.getItem("filters") !== "[]"
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
    } else {
      console.log("catt: ", catt);
      firestore.readDocuments("products", catt).then(async (res) => {
        if (
          localStorage.getItem("filters") &&
          localStorage.getItem("filters") !== "[]"
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
    }
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
      case "dd":
        arr.sort(
          (a, b) =>
            calculatedisc(b.old_pret, b.pret) -
            calculatedisc(a.old_pret, a.pret)
        );
        break;
      case "rc":
        arr.sort((a, b) => b.rating - a.rating);
        break;

      case "rd":
        arr.sort((a, b) => b.reviews.length - a.reviews.length);
        break;
      case "mn":
        arr.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
        break;
    }
    if (nope !== "ok") setProducts((old) => [...arr]);

    // console.log("products", products);
    // console.log("arr", arr);
  };

  const updateFilters = async (arr, filters) => {
    await firestore.filter(arr, filters).then((res) => {
      arr = res;
      console.log(res);
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

      // await firestore.readDocuments("products", catt).then(async (res) => {
      //   if (sort_param) {
      //     sort(res, sort_param);
      //   }
      //   arr = res;
      //   products = res;
      // });

      if (categorie == "reducere") catt = ["old_pret", ">", 0];
      else catt = ["categories", "==", categorie];
      console.log(catt);
      if (categorie.includes("search")) {
        //search ========== includes
        firestore
          .readDocuments("products", ["nume", [], categorie])
          .then(async (res) => {
            if (sort_param) {
              sort(res, sort_param);
            }
            res = await updateFilters(res, filters);

            setProducts((old) => (old = res));
          });
      } else
        firestore.readDocuments("products", catt).then(async (res) => {
          if (sort_param) {
            sort(res, sort_param);
          }

          res = await updateFilters(res, filters);

          setProducts((old) => (old = res));
          console.log(res, products);
          products = res;
          console.log(res, products);

          // console.log(arr);
        });
    }

    localStorage.setItem("filters", JSON.stringify(filters));
    localStorage.setItem("local_filters", JSON.stringify(local_filters));
    console.log("products: ", products);
    const rasp = await updateFilters(products, filters);
    console.log("rasp", rasp);
    console.log(filters);

    if (rasp !== false) {
      if (sort_param) {
        sort(rasp, sort_param, "ok");
      }
      setProducts((old) => (old = rasp));
    } else {
      if (categorie == "reducere") catt = ["old_pret", ">", 0];
      else catt = ["categories", "==", categorie];
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

  const reset = async () => {
    document.querySelectorAll("input[type='checkbox']").forEach((input) => {
      input.checked = false;
    });
    filters = [];
    local_filters = [];
    if (localStorage.getItem("local_filters")) {
      localStorage.setItem("local_filters", "[]");
    }

    if (localStorage.getItem("filters")) {
      localStorage.setItem("filters", "[]");
    }
    // const rasp = await updateFilters(products, filters);
    // if (rasp !== false) {
    //   if (sort_param) {
    //     sort(rasp, sort_param, "ok");
    //   }
    //   setProducts((old) => (old = rasp));
    // } else {
    //   await firestore.readDocuments("products", catt).then(async (res) => {
    //     if (sort_param) {
    //       sort(res, sort_param);
    //     }
    //     arr = res;
    //     setProducts((old) => (old = res));
    //     products = res;
    //     // console.log(arr);
    //   });
    // }

    if (categorie == "reducere") catt = ["old_pret", ">", 0];
    else catt = ["categories", "==", categorie];
    await firestore.readDocuments("products", catt).then(async (res) => {
      if (sort_param) {
        sort(res, sort_param);
      }
      arr = res;
      setProducts((old) => (old = res));
    });
  };

  const calculatedisc = (oldPrice, price) => {
    return ((oldPrice - price) / oldPrice) * 100;
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

                  return (
                    index <= 6 && (
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
                          {index <= 5
                            ? (ar[0] === "over" ? "> " : "$" + ar[0] + " - ") +
                              "$" +
                              ar[1]
                            : index == 6 && <>Discount</>}
                        </label>
                      </div>
                    )
                  );
                })}
              </div>
            </div>
            <h5 className="section-title position-relative text-uppercase mb-3">
              <span className="bg-secondary pr-3">Filter by rating</span>
            </h5>
            <div className="bg-light p-4 mb-30">
              <div>
                {filter_map.map((filter, index) => {
                  let ar = filter[0].split("-");

                  return (
                    index > 6 &&
                    index <= 11 && (
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
                          id={`disc-${index}`}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor={`disc-${index}`}
                        >
                          {[...Array(parseInt(ar[0], 10))].map((a, index) => {
                            return (
                              <i
                                className="fas fa-star text-primary mr-1"
                                key={index}
                              ></i>
                            );
                          })}
                        </label>
                      </div>
                    )
                  );
                })}
              </div>
            </div>
            <h5 className="section-title position-relative text-uppercase mb-3">
              <span className="bg-secondary pr-3">Filter by brand</span>
            </h5>
            <div className="bg-light p-4 mb-30">
              <div>
                {filter_map.map((filter, index) => {
                  let ar = filter[0].split("-");

                  return (
                    index > 11 && (
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
                          id={`brand-${index}`}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor={`brand-${index}`}
                        >
                          {ar[0]}
                        </label>
                      </div>
                    )
                  );
                })}
              </div>
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
                          to={`/shop/${categorie}`}
                          className="dropdown-item"
                          style={{ cursor: "pointer" }}
                        >
                          Fara sortare
                        </Link>
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
                          to={`/shop/${categorie}/rc`}
                          className="dropdown-item"
                          style={{ cursor: "pointer" }}
                        >
                          Cele mai populare
                        </Link>

                        <Link
                          to={`/shop/${categorie}/dd`}
                          className="dropdown-item"
                          style={{ cursor: "pointer" }}
                        >
                          Discount %
                        </Link>
                        <Link
                          to={`/shop/${categorie}/rd`}
                          className="dropdown-item"
                          style={{ cursor: "pointer" }}
                        >
                          Cele mai multe reviews
                        </Link>
                        <Link
                          to={`/shop/${categorie}/mn`}
                          className="dropdown-item"
                          style={{ cursor: "pointer" }}
                        >
                          Cele mai noi
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {products && products != [] ? (
                products.map((prod) => (
                  <Product
                    cantitate={prod.cantitate}
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
