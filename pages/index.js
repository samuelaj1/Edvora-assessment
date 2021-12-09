import Head from "next/head";
import useSWR from "swr";
import React, { useState } from "react";

export default function Home({}) {
  const [products, setEdvoraProducts] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [states, setStates] = useState([]);
  const [grouped_products, setGroupedProducts] = useState({});
  const [all_product_data, setAllProductData] = useState([]);
  const [loading, setLoading] = useState(false);
  // const fetcher = (url) => fetch(url).then((res) => res.json());
  //
  // // let impact_stories = [];
  // let edvora_data_list = [];
  //
  // const { data: edvora_data, error: err_1 } = useSWR(
  //   `https://assessment-edvora.herokuapp.com`,
  //   fetcher
  // );
  //
  // if (edvora_data) {
  //   edvora_data_list = edvora_data;
  //   console.log(edvora_data_list)
  // }
  function handleArrowClick(index) {
    let $elem = window.$("#scrollable-row-" + index);
    let leftPos = $elem.scrollLeft();
    $elem.animate({ scrollLeft: leftPos + 345 }, 800);
  }

  function groupByStateOrCity(arr, type) {
    let data = {};
    arr.forEach((e) => {
      if (data[e.address[type]]) {
        data[e.address[type]].push(e);
      } else {
        data[e.address[type]] = [];
        data[e.address[type]].push(e);
      }
    });
    return data;
  }

  function formatDate(date) {
    let date_val = new Date("2021-03-05T22:40:16.759Z");
    var month =
      Number(date_val.getMonth()) + 1 < 10
        ? "0" + (Number(date_val.getMonth()) + 1)
        : Number(date_val.getMonth()) + 1; //months from 1-12
    var day =
      date_val.getDay() < 10 ? "0" + date_val.getDay() : date_val.getDay();
    var year = date_val.getFullYear();
    return year + ":" + month + ":" + day;
  }

  //handle all select change

  function handleStateChange(event) {
    setSelectedState(event.target.value);
  }

  function handleProductChange(event) {
    setSelectedProduct(event.target.value);
  }

  function handleCityChange(event) {
    setSelectedCity(event.target.value);
  }

  //use effect to filter products on change

  React.useEffect(() => {
    if (selectedState || selectedCity || selectedProduct) {
      handleFilterChange();
    } else {
      //grouping by product name
      const groupBy = (key) => (array) =>
        array.reduce(
          (objectsByKeyValue, obj) => ({
            ...objectsByKeyValue,
            [obj[key]]: (objectsByKeyValue[obj[key]] || []).concat(obj),
          }),
          {}
        );

      const groupByProductName = groupBy("product_name");
      let products = groupByProductName(all_product_data);
      setGroupedProducts(products);
    }
  }, [selectedState, selectedCity, selectedProduct, all_product_data]);

  //main function that handles filtering of the products
  function handleFilterChange() {
    let filtered_product = [];
    filtered_product = all_product_data.filter((item) => {
      return (
        item.address.city.includes(selectedCity) &&
        item.address.state.includes(selectedState) &&
        item.product_name.includes(selectedProduct)
      );
    });

    const groupBy = (key) => (array) =>
      array.reduce(
        (objectsByKeyValue, obj) => ({
          ...objectsByKeyValue,
          [obj[key]]: (objectsByKeyValue[obj[key]] || []).concat(obj),
        }),
        {}
      );

    const groupByProductName = groupBy("product_name");
    let products = groupByProductName(filtered_product);
    setGroupedProducts(products);
  }

  //api call to edvora endpoint
  const getEdvoraData = async () => {
    setLoading(true);
    const res = await fetch(`https://assessment-edvora.herokuapp.com`, {
      method: "GET",
    });
    const results = await res.json();

    setAllProductData(results);

    const groupBy = (key) => (array) =>
      array.reduce(
        (objectsByKeyValue, obj) => ({
          ...objectsByKeyValue,
          [obj[key]]: (objectsByKeyValue[obj[key]] || []).concat(obj),
        }),
        {}
      );

    const groupByProductName = groupBy("product_name");
    let products = groupByProductName(results);
    setEdvoraProducts(Object.keys(products));
    setCities(groupByStateOrCity(results, "city"));
    setStates(groupByStateOrCity(results, "state"));
    setGroupedProducts(products);
    setLoading(false);
  };

  //run on load to get api data from edvora endpoint
  React.useEffect(() => {
    getEdvoraData();
  }, []);

  return (
    <div>
      <Head>
        <title>Home page</title>
      </Head>

      <div
        className="container-fluid"
        style={{ paddingTop: "5rem", paddingBottom: "5rem" }}
      >
        <div className="row">
          <div className="col-md-2">
            <div className="card">
              <div className="card-body">
                <h3 style={{fontSize:'20px',fontStyle: 'normal'}}>Filters</h3>
                <hr className="hr-light" />
                <select
                  className="form-control mb-3 mt-4"
                  onChange={handleProductChange}
                >
                  <option value="">Select Product</option>
                  {products.map((e, i) => {
                    return (
                      <option value={e} key={i}>
                        {e}
                      </option>
                    );
                  })}
                </select>

                <select
                  className="form-control mb-3"
                  onChange={handleStateChange}
                >
                  <option value="">State</option>
                  {Object.keys(states).map((e, i) => {
                    return (
                      <option value={e} key={i}>
                        {e}
                      </option>
                    );
                  })}
                </select>
                <select
                  className="form-control mb-3"
                  onChange={handleCityChange}
                >
                  <option value="">City</option>
                  {Object.keys(cities).map((e, i) => {
                    return (
                      <option value={e} key={i}>
                        {e}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
          <div className="col-md-10">
            <h1>Edvora</h1>
            <h2 style={{ color: "rgba(255, 255, 255, 0.5)" }}>Products</h2>
            {Object.keys(grouped_products).map((product, i) => {
              return (
                <div className="row mb-5" key={i}>
                  <div className="md-col-11">
                    <h3 style={{ fontSize: "20px", fontWeight: "normal" }}>
                      {product}
                    </h3>
                    <hr />
                  </div>
                  <div className="md-col-11">
                    <div className="card">
                      <div className="card-body">
                        <div className="scrollable-row">
                          <div className="row" id={"scrollable-row-" + i}>
                            {grouped_products[product].map(
                              (grouped_product, index) => {
                                return (
                                  <div className="col-md-3" key={index}>
                                    <div
                                      className="card"
                                      style={{
                                        background: "#232323",
                                        borderRadius: "4.68775px",
                                      }}
                                    >
                                      <div className="card-body">
                                        <div className="row">
                                          <div className="col-4 pr-0">
                                            <img
                                              src={grouped_product["image"]}
                                              className="img-fluid text-center"
                                              alt="product name"
                                              style={{
                                                width: "70px",
                                                height: "70px",
                                              }}
                                            />
                                          </div>
                                          <div className="col-8 pl-0">
                                            <div className="product-name">
                                              {grouped_product["product_name"]}
                                            </div>
                                            <div className="brand">
                                              {grouped_product["brand_name"]}
                                            </div>
                                            <div className="price">
                                              $ {grouped_product["price"]}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="row">
                                          <div className="col-4">
                                            <div className="dark-text ml-2">
                                              {
                                                grouped_product["address"][
                                                  "city"
                                                ]
                                              }
                                            </div>
                                          </div>
                                          <div className="col-8 pl-0">
                                            <div className="dark-text">
                                              Date:{" "}
                                              <span className="date-text">
                                                {formatDate(
                                                  grouped_product["time"]
                                                )}
                                              </span>
                                            </div>
                                          </div>
                                          <div className="col-12 dark-text mt-2">
                                            <div className="ml-2">
                                              {grouped_product["discription"]}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="right-arrow">
                        <img
                          onClick={() => handleArrowClick(i)}
                          src="../../assets/images/arrow-right.png"
                          className="img-fluid cursor-pointer"
                          alt=""
                          style={{
                            width: "10px",
                            height: "33px",
                            marginLeft: "2rem",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {!loading && Object.keys(grouped_products).length === 0 ? (
              <div className="text-center mt-5">No products available</div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// export async function getStaticProps() {
//   // Call an external API endpoint to get edvora data.
//   // You can use any data fetching library
//
//   const res = await fetch(`https://assessment-edvora.herokuapp.com`);
//   let edvora_data_list = await res.json();
//   edvora_data_list = edvora_data_list["data"];
//
//   // will receive `edvora_data_list` as a prop at build time
//   return {
//     props: {
//       edvora_data_list,
//     },
//   };
// }
