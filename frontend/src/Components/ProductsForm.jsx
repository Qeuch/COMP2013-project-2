export default function ProductsForm({
  productName,
  brand,
  image,
  price,
  handleOnSubmit,
  handleOnChange,
  isEditing,
}) {
  return (
    <div>
      <form onSubmit={handleOnSubmit}>
        <label htmlFor="productName">Product Name: </label>
        <input
          type="text"
          name="productName"
          id="productName"
          value={productName}
          onChange={handleOnChange}
          placeholder="Enter Product Name"
          required
        />
        <br />
        <label htmlFor="brand">Brand: </label>
        <input
          type="text"
          name="brand"
          id="brand"
          value={brand}
          onChange={handleOnChange}
          placeholder="Enter Brand"
          required
        />
        <br />
        <label htmlFor="image">Image: </label>
        <input
          type="text"
          name="image"
          id="image"
          value={image}
          onChange={handleOnChange}
          placeholder="Enter image URL"
          required
        />
        <br />
        <label htmlFor="price">Price: </label>
        <input
          type="text"
          name="price"
          id="price"
          value={price}
          onChange={handleOnChange}
          placeholder="Price"
          required
        />
        <br />
        <button>{isEditing ? "Edit" : "Submit"}</button>
      </form>
    </div>
  );
}
