import React from "react";
import { Link } from "react-router-dom";
import Firestore from "../js/Firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Placeholder from "../util/Placeholder";
import Text from "../util/Text";
import { useState } from "react";
import { useEffect } from "react";

const firestore = new Firestore();
function Product({
  cantitate,
  img,
  link,
  name,
  price,
  oldPrice,
  id,
  addit,
  rating,
}) {
  const [user, loading, error] = useAuthState(firestore.getuser());
  const [din_cos, setDinCos] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    getcos();
  }, [count, user]);

  const getcos = async () => {
    // return await firestore.getCos(user);
    let prods = await firestore.getProductByUser(user);
    prods.cant = prods.cant.filter((prod) => id === prod.id);
    console.log(prods.cant[0].cant);
    setDinCos(prods.cant[0].cant);
  };


  const addit_prod = async (cant) => {
    setCount((old) => old + 1);
    if (cant + din_cos <= cantitate) addit(id, cant);
    else {
      alert(`Numarul maxim de produse disponibile este ${cantitate}!`);
    }
  };

  return (
    <div
      className="col-lg-3 col-md-4 col-sm-6 pb-1"
      style={{ position: "relative" }}
    >
      {oldPrice > 0 && (
        <div
          style={{
            position: "absolute",
            top: -5,
            left: 5,
            width: "auto",
            background: "red",
            zIndex: 9,
            padding: "4px 20px",
            borderRadius: "0 20px 20px 0 ",
            color: "white",
            fontSize: 18,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span>
            -{" "}
            {Placeholder.makenumber(
              Placeholder.roundit(((oldPrice - price) / oldPrice) * 100, 1)
            )}
          </span>
          <span
            style={{
              fontSize: 20,
              marginLeft: 3,
            }}
          >
            %
          </span>
        </div>
      )}
      <div className="product-item bg-light mb-4">
        <div
          className="product-img position-relative overflow-hidden"
          style={{
            height: 170,
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <img
            className="img-fluid w-100"
            src={img ? img : require("../img/product-1.jpg")}
            alt=""
          />
          <div className="product-action">
            {user && (
              <a
                className="btn btn-outline-dark btn-square"
                title="Adaugă în coș"
                onClick={() => addit_prod(1)}
              >
                <i className="fa fa-shopping-cart"></i>
              </a>
            )}

            <a className="btn btn-outline-dark btn-square" href={link}>
              <i className="fa fa-search"></i>
            </a>
          </div>
        </div>
        <div className="text-center py-4">
          <a className="h6 text-decoration-none text-truncate" href={link}>
            {name}
          </a>

          <div className="d-flex align-items-center justify-content-center mt-2">
            <h5>{Placeholder.makenumber(price)} RON</h5>
            {oldPrice > 0 && (
              <h6 className="text-muted ml-2">
                <del>{Placeholder.makenumber(oldPrice)} RON</del>
              </h6>
            )}
          </div>
          <div className="d-flex align-items-center justify-content-center mb-1">
            {[...Array(5)].map((e, index) => {
              return (
                <>
                  {index >= rating ? (
                    //gol
                    <i
                      className="far fa-star text-primary mr-1"
                      key={index}
                    ></i>
                  ) : index + 1 <= Math.floor(rating) ? (
                    //plin
                    <i
                      className="fas fa-star text-primary mr-1"
                      key={index}
                    ></i>
                  ) : (
                    //jumate
                    <i
                      className="fas fa-star-half-alt text-primary mr-1"
                      key={index}
                    ></i>
                  )}
                </>
              );
            })}
            {/* <small className="fa fa-star text-primary mr-1"></small>
            <small className="fa fa-star text-primary mr-1"></small>
            <small className="fa fa-star text-primary mr-1"></small>
            <small className="fa fa-star text-primary mr-1"></small>
            <small className="fa fa-star text-primary mr-1"></small> */}
            <small>({Placeholder.roundit(rating)})</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
