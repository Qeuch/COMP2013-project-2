import { useState, useEffect } from "react";
import axios from "axios";
import CartContainer from "./CartContainer";
import ProductsContainer from "./ProductsContainer";
import NavBar from "./NavBar";
import ProductsForm from "./ProductsForm";

export default function GroceriesAppContainer({}) {
  const [productQuantity, setProductQuantity] = useState([]);

  // moved this to inside the useEffect
  //  products.map((product) => ({ id: product._id, quantity: 0 }))

  const [cartList, setCartList] = useState([]);

  const [productsData, setProductsData] = useState([]);

  const [formData, setFormData] = useState({
    productName: "",
    brand: "",
    image: "",
    price: "",
  });
  // got rid of this because i wasn't using it anymore after my edits to the code.
  //const [postResponse, setPostResponse] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  useEffect(
    () => {
      handleProductsDB();
    },
    [] /* [postResponse]*/ // got rid of this
  );

  // handlers
  const handleProductsDB = async () => {
    try {
      const response = await axios.get("http://localhost:3000/products");
      setProductsData(response.data);

      setProductQuantity(
        response.data.map((product) => ({ id: product._id, quantity: 0 }))
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  // handle reset form
  const handleResetForm = () => {
    setFormData({
      productName: "",
      brand: "",
      image: "",
      price: "",
    });
  };

  // handle on submit
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        handleOnUpdate(formData._id);
        handleResetForm();
        setIsEditing(false);
      } else {
        await axios
          .post("http://localhost:3000/products", formData)
          .then((response) => {
            //setPostResponse(response.data.message);
            console.log(response);
          })
          .then(() => {
            handleResetForm();
            handleProductsDB();
          });
      }
    } catch (error) {
      console.log(error.message);
      console.log(error.response.data);
      console.log(error.response.status);
    }
  };

  // handle on change
  const handleOnChange = (e) => {
    setFormData((prevData) => {
      return { ...prevData, [e.target.name]: e.target.value };
    });
  };

  // handle deleting a product
  const handleOnDelete = async (_id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/products/${_id}`
      );
      //etPostResponse(response.data.message);
      handleProductsDB();
      console.log(response);
    } catch (error) {
      console.log(error.message);
    }
  };

  // handle editing a product
  const handleOnEdit = async (_id) => {
    try {
      const productToEdit = await axios.get(
        `http://localhost:3000/products/${_id}`
      );
      console.log(productToEdit);
      setFormData({
        productName: productToEdit.data.productName,
        brand: productToEdit.data.brand,
        image: productToEdit.data.image,
        price: productToEdit.data.price,
        _id: productToEdit.data._id,
      });
      setIsEditing(true);
    } catch (error) {
      console.log(error);
    }
  };

  // handle on update
  const handleOnUpdate = async (_id) => {
    try {
      const result = await axios.patch(
        `http://localhost:3000/products/${_id}`,
        formData
      );
      await handleProductsDB();
      //setPostResponse(result.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddQuantity = (productId, mode) => {
    if (mode === "cart") {
      const newCartList = cartList.map((product) => {
        if (product._id === productId) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });
      setCartList(newCartList);
      return;
    } else if (mode === "product") {
      const newProductQuantity = productQuantity.map((product) => {
        if (product.id === productId) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });
      setProductQuantity(newProductQuantity);
      return;
    }
  };

  const handleRemoveQuantity = (productId, mode) => {
    if (mode === "cart") {
      const newCartList = cartList.map((product) => {
        if (product._id === productId && product.quantity > 1) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      });
      setCartList(newCartList);
      return;
    } else if (mode === "product") {
      const newProductQuantity = productQuantity.map((product) => {
        if (product.id === productId && product.quantity > 0) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      });
      setProductQuantity(newProductQuantity);
      return;
    }
  };

  const handleAddToCart = (productId) => {
    const product = productsData.find((product) => product._id === productId);
    const pQuantity = productQuantity.find(
      (product) => product.id === productId
    );
    const newCartList = [...cartList];
    const productInCart = newCartList.find(
      (product) => product._id === productId
    );
    if (productInCart) {
      productInCart.quantity += pQuantity.quantity;
    } else if (pQuantity.quantity === 0) {
      alert(`Please select quantity for ${product.productName}`);
    } else {
      newCartList.push({ ...product, quantity: pQuantity.quantity });
    }
    setCartList(newCartList);
  };

  const handleRemoveFromCart = (productId) => {
    const newCartList = cartList.filter((product) => product._id !== productId);
    setCartList(newCartList);
  };

  const handleClearCart = () => {
    setCartList([]);
  };

  return (
    <div>
      <ProductsForm
        productName={formData.productName}
        brand={formData.brand}
        image={formData.image}
        price={formData.price}
        handleOnSubmit={handleOnSubmit}
        handleOnChange={handleOnChange}
        isEditing={isEditing}
      />
      <NavBar quantity={cartList.length} />
      <div className="GroceriesApp-Container">
        <ProductsContainer
          products={productsData}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleAddToCart={handleAddToCart}
          productQuantity={productQuantity}
          handleOnDelete={handleOnDelete}
          handleOnEdit={handleOnEdit}
        />
        <CartContainer
          cartList={cartList}
          handleRemoveFromCart={handleRemoveFromCart}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleClearCart={handleClearCart}
        />
      </div>
    </div>
  );
}
