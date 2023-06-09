import logo from "./logo.svg";
import "./App.css";
import Home from "./components/Home";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductPage from "./components/ProductPage";
import Shop from "./components/Shop";
import Contact from "./components/Contact";
import AdminPage from "./components/AdminPage";
import { getAuth } from "@firebase/auth";
import Footer from "./components/Footer";
import Checkout from "./components/Checkout";
import Firestore from "./js/Firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Cart from "./components/Cart";
import Notfound from "./components/Notfound";
import Return from "./components/Return";

const firestore = new Firestore();
const auth = getAuth();

function App() {
  const [user, loading, error] = useAuthState(auth);
  const [cos, setCos] = useState(0);
  const [cos_ev, setCosEv] = useState(0);

  const getCos = async () => {
    setCos(await firestore.getCos(user));
    // console.log(await firestore.getCos(user));
  };

  useEffect(() => {
    getCos();
    // await setCos(await firestore.getCos());
  }, [cos_ev, user]);

  const addit = async (id, cant) => {
    firestore.addit(id, user, cant);
    setCosEv((old) => old + cant);
  };

  const delete_prod_app = async (id, cant) => {
    await firestore.deleteDocument("cos", id).then((res) => {
      setCosEv((old) => old - cant);
      alert("Produs scos din cosul tau!");
    });
  };

  const update = async (cant, uid) => {
    await firestore
      .updateDocument("cos", uid, { cantitate: cant })
      .then((res) => {
        setCosEv((old) => old + 32);
        alert("cantitatea s-a updatat!");
      });
  };

  const finish = async () => {
    return await firestore
      .delete_all_from_cart_by_user_id(user.uid)
      .then((res) => {
        setCosEv((old) => old - 13);
        console.log(res);
      });
  };

  const fixCant = async (hidden) => {
    console.log(hidden);
    hidden.forEach(async (element) => {
      await firestore.getProductById(element.id).then(async (res) => {
        console.log(res.id, ": ", res.cantitate - element.cant);
        await firestore
          .updateDocument("products", res.id, {
            cantitate: res.cantitate - element.cant,
          })
          .then((ress) => {
            console.log(ress);
          });
      });
    });

    return true;
  };

  return (
    <Router>
      <Navbar cos={cos} />
      <Routes>
        <Route path="/" element={<Home addit={addit} />} />
        <Route
          path="/shop/:categorie/:sort_param?/:price?"
          element={<Shop addit={addit} />}
        />
        <Route path="/prod/:id" element={<ProductPage addit={addit} />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/checkout"
          element={<Checkout finish={finish} fixCant={fixCant} />}
        />
        <Route
          path="/cart"
          element={<Cart delete_prod_app={delete_prod_app} update={update} />}
        />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/return" element={<Return />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
