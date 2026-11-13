import { memo, useMemo, useReducer } from "react";
import { useCallback } from "react";
import { createContext, useContext, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
const productContext = createContext();
const initialState = [];
const Home = memo(function Home() {


  const share = useContext(productContext);

  return (<>
    <div style={{ background: "lightgreen", width: 1300, height: 1000 }}>
      <h1 style={{ color: "black", marginLeft: 30 }}>welcome to selina's shopping center </h1>

      <form onSubmit={(e) => {

        e.preventDefault();

        share.setForm(true);
      }}>

        <input type="text" placeholder="Enter your name" required />

        <input type="email" placeholder="Enter your email" required />

        <button type="submit" >Log In</button>

      </form>



      {share.form === true && <nav><Link to="/cart" style={{ textAlign: "right", color: "red", marginRight: 30 }}>Cart</Link>
        <Link to="/product" style={{ textAlign: "center" }}>Product</Link></nav>}
    </div>
  </>
  )
  // setCount[false];
})
function Product() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState([]);
  const cart = useContext(productContext);

  const itemfind = useCallback(async () => {


    setLoading(true);

    setError("");

    try {

      const response = await fetch("https://fakestoreapi.com/products");

      // const response = await fetch("https://fakestoreapi.com/wrong-url");

      if (response.ok) {

        const result = await response.json();

        setItem(result);

      } else {

        throw new Error("Failed to load products");

      }


    }
    catch {

      setError("network error");

    }
    finally {
      setLoading(false);
    }
  }, []);
  return (<>
    <div style={{ background: "lightblue" }}>
      <h1>Product</h1>

      <button onClick={itemfind}>Find Products</button>
      {loading && <h2>Getting your products...</h2>}
      {error && <h2>{error}</h2>}
      {/* <h1>{item}</h1> */}
      {item.map((pro) => {
        return (
          <div key={pro.id}>
            <h1 >{pro.title}</h1>

            <button onClick={() => cart.dispatch({ type: "ADD PRODUCT", product: pro, price: pro.price })}>add product</button>

          </div>)
      })}
    </div>
  </>)
}
function Cart() {
  const productNum = useContext(productContext);
  const result = useMemo(() => { return productNum.state.reduce((sum, pro) => { return (sum + pro.price) }, 0) }, [productNum.state]);
  return (<>
    <div style={{ background: "lightgreen" }}>
      <h1>Cart</h1>
      {productNum.state.map((pro, index) => {

        return (
          <>


            <div key={index}>

              <h2>{pro.title}</h2>

              <p>Price: ${pro.price}</p>

              <button onClick={() => productNum.dispatch({ type: "REMOVE PRODUCT", index: index })}>remove product</button>


            </div>

          </>);

      })}


      {/* {<button onClick={() => productNum.dispatch({ type: "REMOVE PRODUCT" })}>remove product</button>} */}

      {<button onClick={() => productNum.dispatch({ type: "RESET" })}>reset</button>}

    </div >
    <h1>total price: {result}</h1>
  </>)
}



const Contact = memo(function Contact() {
  return (
    <div style={{ display: "flex", alignItems: "center", color: "black", backgroundColor: "lightblue", flexDirection: "column", width: 1300, height: 1000 }}>
      <p>Contact : +2343 4598 458 </p>
      <p>email : mam.mono@gmail.com </p>
      <h1>thank you for choice us </h1>
    </div>)
})
function reducer(state, action) {
  switch (action.type) {
    case "ADD PRODUCT":
      return [...state, action.product];


    case "REMOVE PRODUCT":

      return (state.filter((x, index) => index != action.index));


    case "RESET":
      return initialState;

    default:

      return state;
  }
}
function App() {
  const [form, setForm] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  return <>
    <productContext.Provider value={{ state, dispatch, form, setForm }}>
      <BrowserRouter>
        <nav>
          <Link to="/">Home</Link>{" "}


          <Link to="/contact">Contact</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>

      </BrowserRouter>

    </productContext.Provider>


  </>

}

export default App
