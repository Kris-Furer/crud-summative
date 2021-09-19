$(document).ready(function() {
  var results = document.querySelector('#results');
  // Declaring variables to avoid scope issues later
  var selectedToDelete = ["defined later"];
  var selection = ["defined later"];
  var viewProdh1 = document.querySelector('#viewProduct');
  // Getting config.json from front end


  let url; //declare url as a variable in es6
  $.ajax({
    url: 'config.json',
    type: 'GET',
    dataType: 'json',
    success: function(configData) {
      console.log(configData.SERVER_URL, configData.SERVER_PORT);
      url = `${configData.SERVER_URL}:${configData.SERVER_PORT}`;

    },
    error: function(error) {
      console.log(error);
    }

  }); //ajax

  // User login  UI ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  // Fade Login screen to sign up screen
  $("#toSignUp").click(function() {
    $('.sign-up-form').fadeIn();
    $('.login-form').fadeOut();
  });
  // Fade Sign up screen to login screen
  $("#toLogin").click(function() {
    $('.sign-up-form').fadeOut();
    setTimeout(function() {
      $('.login-form').fadeIn();
    }, 500);
  });
  $("#SignUp").click(function() {

  });


  // User register Method::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  $('#signUp').click(function() {
    event.preventDefault(); //this prevents code breaking when no data is found
    let userName = $('#floatingRegUsername').val();
    let email = $('#floatingRegEmail').val();
    let password = $('#floatingRegPassword').val();
    console.log(userName, email, password);

    if (userName == '' || email == '' || password == '') {
      alert('Please enter all details');

    } else {
      $.ajax({
        url: `http://localhost:3002/registerUser`,
        type: 'POST',
        data: {
          username: userName,
          email: email,
          password: password
        },
        success: function(user) {
          console.log(user); //remove when development is finished
          if (!user ==
            'username taken already. Please try another name') {
            alert('Please login to manipulate the products data');

          } else {
            alert('success');
            $('.sign-up-form').fadeOut();
            setTimeout(function() {
              $('.login-form').fadeIn();
            }, 500);
            //event.
          } //else

        }, //success
        error: function() {
          console.log('error: cannot call api');
        } //error
      }); //ajax post
    } //if

  }); //r-submit click


  // Login Method ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  $('#login').click(function() {
    event.preventDefault();
    let userName = $('#floatingUserName').val();
    let password = $('#floatingPassword').val();

    console.log(userName,
      password); //remove after development for security

    if (userName == '' || password == '') {
      alert('Please enter all details');
    } else {
      $.ajax({
        url: `http://localhost:3002/loginUser`,
        type: 'POST',
        data: {
          username: userName,
          password: password
        },
        success: function(user) {
          console.log(user);

          if (user == 'user not found. Please register') {
            alert(
              'user not found. Please enter correct data or register as a new user'
            );
          } else if (user == 'not authorized') {
            alert('Please  try with correct details');
            $('#floatingUserName').val('');
            $('#floatingPassword').val('');
          } else {
            sessionStorage.setItem('userID', user['_id']);
            sessionStorage.setItem('userName', user['username']);
            sessionStorage.setItem('userEmail', user['email']);
            window.location = 'landing.html';
          }
        }, //success
        error: function() {
          console.log('error: cannot call api');
        } //errror

      }); //ajax
    } //if else
  });



  // logout:::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  // var logout = document.querySelector('#logoutBtn');
  //   logout.onclick = function() {
  //     console.log('You are logged out');
  //     console.log(sessionStorage);
  //     window.location = "index.html";
  // }


  $('.header-user').text(sessionStorage.getItem('userName'));

  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  // Add Listing method:::::::::::::::::::::::::::::::::::::::::::::::::::::
  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  $('#listItem').click(function() {
    event.preventDefault();
    let listTitle = $('#floatingListTitle').val();
    let price = $('#floatingListPrice').val();
    let genre = $('#floatingListGenre').val();
    let listConsole = $('#floatingListConsole').val();
    let description = $('#floatingListDescription').val();
    let imgUrl = $('#floatingListImg').val();
    let condition = $('#floatingListCondition').val();
    let userId = sessionStorage.getItem('userID');
    console.log(userId);
    console.log(listTitle, price); //remove after development for security

    if (listTitle == '' || price == '') {
      alert('Title and price information are required');
    } else {
      // modal show
      $("#listConfirmationModal").modal("show");

      $("#confirmListing").click(function() {
        $.ajax({
          url: `http://localhost:3002/addProduct`,
          type: 'POST',
          data: {
            name: listTitle,
            price: price,
            image: imgUrl,
            console: listConsole,
            genre: genre,
            description: description,
            condition: condition,
            itemLocation: 'south',
            created_at: Date.now(),
            user_id: userId
          },
          success: function(product) {

            window.location = "my-list.html";

          }, //success
          error: function() {
            console.log('error: cannot call api');
          } //errror

        }); //ajax
      });

    } //if else
  });


  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  // display all results on landing page  :::::::::::::::::::::::::::::::::::::::::
  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  function showAllResults() {

    $.ajax({
      url: `http://localhost:3002/allProductsFromDB`,
      type: 'GET',
      dataType: 'json',
      success: function(productsFromMongo) {
        console.log(productsFromMongo);
        console.log(url + "weirrrd");
        var i;
        // Create all the cards on the home screen
        for (i = 0; i < productsFromMongo.length; i++) {
          // create parent card div for each item
          var productCard = document.createElement("div");
          results.appendChild(productCard);
          productCard.classList.add('col-xs-12', 'col-sm-6', 'col-md-4', 'my-3');
          // fill the cards content
          productCard.value = productsFromMongo[i].name
          productCard.innerHTML = `<div class="card h-100" data-bs-toggle="modal"
            data-bs-target="#staticBackdrop2">

            <img src="${productsFromMongo[i].image}" data-name="${productsFromMongo[i].name}" class="card-img-top viewItem" alt="Image of game" value = "${productsFromMongo[i].name}">
            <div value= "${productsFromMongo[i].name}" class="card-body">
              <h5 class="card-title">${productsFromMongo[i].name}</h5>
              <p value='${productsFromMongo[i].name}' class="card-text viewItem" >${productsFromMongo[i].description}</p>
              <p class="price">${productsFromMongo[i].price}</p>
            </div>
          </div>
          `;
        }

        // Find which card the user has clicked
        document.addEventListener('click', function(e) {
          // define the target objects by class name
          if (e.target.classList.contains('viewItem')) {
            console.log("has view item");
            console.log(e.target.dataset.name);
            console.log(e.target);
            // find a match between a button value and product name
            for (var i = 0; i < productsFromMongo
              .length; i++) {
              if (e.target.dataset.name == productsFromMongo[i].name) {
                selection = i;
                console.log("match!");
                console.log(productsFromMongo[selection].name);
                console.log(selection);
                console.log(productsFromMongo[i]);

                $("#productModal").modal("show");

                viewProduct()

              }
            }
          }
        }); // Event listner ends


        function viewProduct() {
          $('#viewProducth1').text(productsFromMongo[selection].name)
          $('#viewProductPrice').text("$" + productsFromMongo[selection].price)
          $('#viewProductDescription').text(productsFromMongo[selection].description)
          var viewProductImg = document.querySelector('#viewProductImg')
          viewProductImg.src = productsFromMongo[selection].image


        }


      }, // submit success fuction ends
      error: function() {
        console.log("");
      }
    }); //ajax
  }

  if (results) {
    showAllResults();
  }




  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  //   Reset search with filters  ::::::::::::::::::::::::::::::::::::::::::::::::::::::
  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  // $('#filter').click(function() {
  //   selectedGenre =  document.querySelector('#filterGenre').value
  //
  //   $.ajax({
  //     url: `/allProductsFromDB/Genre`,
  //     type: 'GET',
  //     dataType: 'json',
  //
  //     success: function(productsFromMongo) {
  //       var i;
  //
  //       for (i = 0; i < productsFromMongo.length; i++) {
  //         // $('.card-container').innerHTML +=`
  //         //   input front end code here
  //         //
  //         // `
  //
  //       }
  //
  //     }, // submit success fuction ends
  //     error: function() {}
  //   }) //ajax
  // }) // Submit/all products from mongo call ends


  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  //    Show user listings on my - list html :::::::::::::::::::::::::::::::::::::::::
  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  var listingContainer = document.querySelector('#listingContainer');

  function showUserListings() {
    var currentUser = sessionStorage.getItem('userID');

    $.ajax({
      url: `http://localhost:3002/allProductsFromDB/userListings`,
      type: 'GET',
      dataType: 'json',
      data: {
        user_id: currentUser
      },
      success: function(productsFromMongo) {
        console.log(productsFromMongo);
        var i;
        var listingContainer = document.querySelector('#listingContainer');
        listingContainer.innerHTML = "";
        for (i = 0; i < productsFromMongo.length; i++) {
          // create card div for each item
          var productCard = document.createElement("div");
          listingContainer.appendChild(productCard);
          productCard.classList.add('col-xs-12', 'col-sm-6', 'col-md-4', 'my-3');
          // fill the cards content
          productCard.innerHTML = `
          <div class="card h-100">
            <img src="${productsFromMongo[i].image}" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">${productsFromMongo[i].name}</h5>
              <p class="card-text">${productsFromMongo[i].description}</p>
              <p class="price">${productsFromMongo[i].price}</p>
            </div>
            <div class="card-footer bg-transparent align-self-end">
              <div class="btn-group" role="group" aria-label="basic outlined example">
                <button type="button" value="${productsFromMongo[i].name}" class="btn btn-outline-warning"><i class="edit fa fa-pencil" aria-hidden="true"></i>
                </button>
                <button type="button" value="${productsFromMongo[i].name}" class="btn btn-outline-warning"><i class="fa fa-trash deleteItem" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </div>
          `;
        }

        // Update Listing Even Listener::::::::::::::::::::::::::::::::::::::::::::::::
        document.addEventListener('click', function(e) {
          // define the target objects by class name
          if (e.target.classList.contains('fa-pencil')) {

            // find a match between a button value and product name
            for (var i = 0; i < productsFromMongo
              .length; i++) {
              if (productsFromMongo[i].name == e.target.parentNode.value) {
                selection = i;
                console.log(productsFromMongo[selection].name);
                console.log(selection);
                console.log(productsFromMongo[i]);
                // e.target.parentNode.parentNode.remove()
                $("#updateProductForm").modal("show");
                updateProduct();
              }
            }
          }
        }); // Event listner ends


        // Delete Event Listener:::::::::::::::::::::::::::::::::::::::::::::::::
        document.addEventListener('click', function(e) {
          // define the target objects by class name

          if (e.target.classList.contains('deleteItem')) {
            // find a match between a button value and product name
            for (var i = 0; i < productsFromMongo
              .length; i++) {
              if (productsFromMongo[i].name == e.target
                .parentNode.value) {
                selectedToDelete = i;
                console.log(productsFromMongo[selectedToDelete]);
                console.log(selectedToDelete);
              } //if value matched object ends

              $('.delete-modal').modal('show');
              $('#closeDelOverlay').click(function() {
                $('.delete-modal').modal('hide');
              });
              $("#confirmDelete").click(function() {
                $('.delete-modal').modal('hide');
                console.log(productsFromMongo[selectedToDelete].name);
                console.log(selectedToDelete);
                // e.target.parentNode.parentNode.remove()
                deleteProduct();
                console.log(productsFromMongo[selectedToDelete]._id);
              });

            } // loop ends



          } // if target ends

        }); // Event listner ends


        function deleteProduct() {
          // event.preventDefault();
          // if (!sessionStorage['userID']) {
          //   alert('401 permission denied');
          //   return;
          // };
          console.log(selection = "play the game");

          let productId = productsFromMongo[selectedToDelete]._id;

          $.ajax({
            url: `http://localhost:3002/deleteProduct/${productsFromMongo[selectedToDelete]._id}`,
            type: 'DELETE',
            data: {
              user_id: sessionStorage['userID']
            },
            success: function(data) {
              console.log(data);
              console.log("deleted");
              if (data == 'deleted') {

                showUserListings();
                // alert('deleted');
              } else {
                alert('Enter a valid id');
              } //else
            }, //success
            error: function() {
              console.log('error: cannot call api');
            } //error
          }); //ajax
        } // Delete Product Funtion ENds


        function updateProduct() {
          // Prefilling the forms with current values
          $('#upProductName').val(productsFromMongo[selection].name);
          $('#upProductPrice').val(productsFromMongo[selection].price);
          $('#upProductGenre').val(productsFromMongo[selection].genre);
          $('#upProductConsole').val(productsFromMongo[selection].console);
          $('#upProductCondition').val(productsFromMongo[selection].condition);
          $('#upProductImg').val(productsFromMongo[selection].image);
          $('#upProductDecription').val(productsFromMongo[selection].description);

          // Button to corfirm updates
          $('#updateListingConfirm').click(function() {
            console.log("what are you doing?");
            event.preventDefault();
            let productId = productsFromMongo[selection]._id;
            let productName = $('#upProductName').val();
            let productPrice = $('#upProductPrice').val();
            let productGenre = $('#upProductGenre').val();
            let productConsole = $('#upProductConsole').val();
            let productDescription = $('#upProductDecription').val();
            let productCondition = $('#upProductCondition').val();
            let productImg = $('#upProductImg').val();
            let userid = sessionStorage.getItem('userID');


            $.ajax({
              url: `http://localhost:3002/updateProduct/${productId}`,
              type: 'PATCH',
              data: {
                name: productName,
                price: productPrice,
                genre: productGenre,
                console: productConsole,
                description: productDescription,
                condition: productCondition,
                image: productImg,
                _id: productId,
                user_id: userid
              },
              success: function(data) {
                console.log(data);
                console.log("you pretty good mate");
                if (data ==
                  '401 error: user has no permission to update'
                ) {
                  alert(
                    '401 error: user has no permission to update'
                  );
                } else {
                  alert('updated');
                  $("#updateProductForm").modal("hide");
                  showUserListings();
                } //else

              }, //success
              error: function() {
                console.log('error:cannot call api');
              } //error
            }); //ajax
            // } //if
          }); //updateProduct click function
        } //update product function
      }, // Show User Listings success function ends
      error: function() {}
    }); // patch ajax ends
  } // show user listings function ends



  if (listingContainer) {
    showUserListings();
  }
}); // doc ready ends
