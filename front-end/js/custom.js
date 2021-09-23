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

  // User register Method::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  $('#signUp').click(function() {
    event.preventDefault(); //this prevents code breaking when no data is found
    let userName = $('#floatingRegUsername').val();
    let email = $('#floatingRegEmail').val();
    let password = $('#floatingRegPassword').val();

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
          if (!user == 'username taken already. Please try another name') {
            alert('Please login to manipulate the products data');

          } else {
            alert('success');
            $('.sign-up-form').fadeOut();

            setTimeout(function() {
              $('.login-form').fadeIn();
            }, 500);
            //event.
          } //else ends
        }, //success ends
        error: function() {} //error ends
      }); //ajax post ends
    } //if ends
  }); //register-submit click ends


  // Login Method ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  $('#login').click(function() {
    event.preventDefault();
    let userName = $('#floatingUserName').val();
    let password = $('#floatingPassword').val();

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
          } //else emds
        }, //success ends
        error: function() {} //errror ends
      }); //ajax ends
    } //if ends
  }); //login click ends

  //getting user's name on landing page
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
          }, //success ends
          error: function() {} //errror ends
        }); //ajax ends
      }); //confirm click ends
    } //if else ends
  }); //list item click ends


  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  // display all results on landing page  :::::::::::::::::::::::::::::::::::::::::
  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  function showAllResults() {

    $.ajax({
      url: `http://localhost:3002/allProductsFromDB`,
      type: 'GET',
      dataType: 'json',
      success: function(productsFromMongo) {

        var i;
        // Create all the cards on the home screen
        for (i = 0; i < productsFromMongo.length; i++) {
          // create parent card div for each item
          var productCard = document.createElement("div");
          results.appendChild(productCard);
          productCard.classList.add('col-xs-12', 'col-sm-6', 'col-md-4', 'my-3', 'anime-card');
          // fill the cards content
          productCard.value = productsFromMongo[i].name;

          productCard.innerHTML = `<div class="card h-100">

            <img src="${productsFromMongo[i].image}" data-name="${productsFromMongo[i].name}" class="card-img-top viewItem" alt="Image of game" value = "${productsFromMongo[i].name}">
            <div data-name="${productsFromMongo[i].name}" class="card-body viewItem">
              <h4 class="card-title fw-bold">${productsFromMongo[i].name}</h4>
              <p class="price">$${productsFromMongo[i].price}</p>
              <span class="fw-bold">Console</span>
              <p class="console">${productsFromMongo[i].console}</p>
              <span class="fw-bold">Genre</span>
              <p class="genre">${productsFromMongo[i].genre}</p>

              <p data-name="${productsFromMongo[i].name}" class="card-text viewItem" >${productsFromMongo[i].description}</p>
            </div>
          </div>
          `;


          anime({
            targets: '.card',
            translateY: -500,
            delay: anime.stagger(500, {
              start: 4000
            }, {
              from: 'first'
            }),
            duration: 2000,
            loop: false
          }); //animation ends
        } //for loop ends

        // Find which card the user has clicked
        document.addEventListener('click', function(e) {
          // define the target objects by class name
          if (e.target.classList.contains('viewItem')) {
            // find a match between a button value and product name
            for (var i = 0; i < productsFromMongo.length; i++) {
              if (e.target.dataset.name == productsFromMongo[i].name) {
                var comments = document.querySelector('.comment-accordion');
                selection = i;
                $("#productModal").modal("show");
                viewProduct();

                let commentElements = [];
                if (productsFromMongo[i].comments !== null) {
                  let commentList = productsFromMongo[i].comments;
                  for (x = 1; x < commentList.length; x++) {
                    commentElements += `<li>${commentList[x]}</li>`;
                  } //for Ends
                } //if Ends

                //comments on products
                comments.innerHTML = `<ul class="commentBox my-2" data-id="${productsFromMongo[i]._id}">${commentElements}</ul>
                                      <div class="form-group form-floating">
                                        <textarea style="height: 100px" id="floatingComment" class="form-control my-2" name="comment" placeholder="Leave a comment here" data-id="${productsFromMongo[i]._id}"></textarea>
                                        <label for="floatingComment">Leave a comment</label>
                                      </div>
                                      <button type="button" name="button" class="btn btn-warning btn-block my-3 commented" data-id="${productsFromMongo[i]._id}">Comment</button>`;
              } //if Ends
            } //for Ends
          } //if Ends
        }); // Event listner ends

        // comment Button
        $(document).on('click', '.commented', function(event) {
          event.preventDefault();
          let postID = this.dataset.id;
          let userComment = $("textarea[data-id='" + postID + "']").val();

          if (userComment == '') {
            alert('Please enter a comment');
          } else {
            $.ajax({
              url: `http://localhost:3002/postComment/${postID}`,
              type: 'PATCH',
              data: {
                comment: userComment
              },
              success: function(data) {
                if (data == '401 error: user has no permission to update ') {
                  alert('401 error: user has no permission to update ');
                } else {
                  alert('updated');
                } //else Ends
                $("input[data-id='" + postID + "']").val('');
                $(".commentBox[data-id='" + postID + "']").append(`<li>${userComment}</li> <p class="text-muted">by: ${sessionStorage.getItem('userName')}</p>`);
                showAllResults();
              }, //success Ends
              error: function() {} //error Ends
            }); //ajax Ends
          } //if Ends
        }); //event listener Ends

        //view product function
        function viewProduct() {

          $('#viewProducth1').text(productsFromMongo[selection].name);
          $('#viewProductPrice').text("$" + productsFromMongo[selection].price);
          $('#viewProductDescription').text(productsFromMongo[selection].description);
          var viewProductImg = document.querySelector('#viewProductImg');
          viewProductImg.src = productsFromMongo[selection].image;
          $('#viewProductCondition').text(productsFromMongo[selection].condition);


        }

      }, // submit success fuction ends
      error: function() {} //error Ends
    }); //ajax ends
  } //function Ends

  if (results) {
    showAllResults();
  }

  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  //   Reset search with filters  ::::::::::::::::::::::::::::::::::::::::::::::::::::::
  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  $('#setFilter').click(function() {
    selectedGenre =  document.querySelector('#floatingFilterGenre').value;
    selectedConsole =  document.querySelector('#floatingFilterConsole').value;
    selectedCondition =  document.querySelector('#floatingFilterCondition').value;
    if (selectedConsole === "undefined" ) {
      selectedConsole = undefined;
    }
    if (selectedCondition  === "undefined" ) {
      selectedCondition  = undefined;
    }
    if (selectedGenre  === "undefined" ) {
      selectedGenre  = undefined;
    }


    $.ajax({
      url: `http://localhost:3002/allProductsFromDB/Filter`,
      type: 'GET',
      dataType: 'json',
      data:{
        genre:selectedGenre,
        console:selectedConsole,
        condition:selectedCondition
      },
      success: function(productsFromMongo) {
        var i;

        // Create all the cards on the home screen
        results.innerHTML = "";
        for (i = 0; i < productsFromMongo.length; i++) {
          // create parent card div for each item
          var productCard = document.createElement("div");
          results.appendChild(productCard);
          productCard.classList.add('col-xs-12', 'col-sm-6', 'col-md-4', 'my-3');
          // fill the cards content
          productCard.value = productsFromMongo[i].name;
          productCard.innerHTML = `<div class="card h-100">

            <img src="${productsFromMongo[i].image}" data-name="${productsFromMongo[i].name}" class="card-img-top viewItem" alt="Image of game" value = "${productsFromMongo[i].name}">
            <div data-name="${productsFromMongo[i].name}" class="card-body viewItem">
              <h4 class="card-title fw-bold">${productsFromMongo[i].name}</h4>
              <p class="price">$${productsFromMongo[i].price}</p>
              <span class="fw-bold">Console</span>
              <p class="console">${productsFromMongo[i].console}</p>
              <span class="fw-bold">Genre</span>
              <p class="genre">${productsFromMongo[i].genre}</p>

              <p data-name="${productsFromMongo[i].name}" class="card-text viewItem" >${productsFromMongo[i].description}</p>
            </div>
          </div>`
          ;
        }

      }, // submit success fuction ends
      error: function() {
        console.log("cannot call api");
      }
    }); //ajax
  }); // Submit/all products from mongo call ends


  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  //    Show user listings on my - list html :::::::::::::::::::::::::::::::::::::::::
  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  var listingContainer = document.querySelector('#listingContainer');

  //function starts
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
        var i;
        var listingContainer = document.querySelector('#listingContainer');
        listingContainer.innerHTML = "";

        for (i = 0; i < productsFromMongo.length; i++) {
          // create card div for each item
          var productCard = document.createElement("div");
          listingContainer.appendChild(productCard);
          productCard.classList.add('col-xs-12', 'col-sm-6', 'col-md-4', 'my-3');
          // fill the cards content
          productCard.innerHTML =`<div class="card h-100">
                                    <img src="${productsFromMongo[i].image}" class="card-img-top" alt="...">
                                    <div class="card-body">
                                      <h5 class="card-title">${productsFromMongo[i].name}</h5>
                                      <p class="price">$${productsFromMongo[i].price}</p>
                                      <p class="console">${productsFromMongo[i].console}</p>
                                      <p class="genre">${productsFromMongo[i].genre}</p>
                                      <p class="condition">${productsFromMongo[i].condition}</p>
                                    </div>
                                    <div class="card-footer bg-transparent align-self-end">
                                      <div class="btn-group" role="group" aria-label="basic outlined example">
                                        <button type="button" value="${productsFromMongo[i].name}" class="btn btn-outline-warning"><i class="edit fa fa-pencil" aria-hidden="true"></i></button>
                                        <button type="button" value="${productsFromMongo[i].name}" class="btn btn-outline-warning"><i class="fa fa-trash deleteItem" aria-hidden="true"></i></button>
                                      </div>
                                    </div>
                                  </div>`;
        } //for loop ends

        // Update Listing Even Listener::::::::::::::::::::::::::::::::::::::::::::::::
        document.addEventListener('click', function(e) {
          // define the target objects by class name
          if (e.target.classList.contains('fa-pencil')) {

            // find a match between a button value and product name
            for (var i = 0; i < productsFromMongo.length; i++) {
              if (productsFromMongo[i].name == e.target.parentNode.value) {
                selection = i;
                $("#updateProductForm").modal("show");
                updateProduct();
              } //if ends
            } //for loop ends
          } //if ends
        }); // Event listner ends


        // Delete Event Listener:::::::::::::::::::::::::::::::::::::::::::::::::
        document.addEventListener('click', function(e) {
          // define the target objects by class name

          if (e.target.classList.contains('deleteItem')) {
            // find a match between a button value and product name
            for (var i = 0; i < productsFromMongo.length; i++) {
              if (productsFromMongo[i].name == e.target.parentNode.value) {
                selectedToDelete = i;
              } //if value matched object ends

              //modal shows
              $('.delete-modal').modal('show');
              //modal click
              $('#closeDelOverlay').click(function() {
                $('.delete-modal').modal('hide');
              });

              //modal click
              $("#confirmDelete").click(function() {
                $('.delete-modal').modal('hide');
                deleteProduct();
              });
            } // for loop ends
          } // if target ends
        }); // Event listner Ends

        //delete function
        function deleteProduct() {
          let productId = productsFromMongo[selectedToDelete]._id;

          $.ajax({
            url: `http://localhost:3002/deleteProduct/${productsFromMongo[selectedToDelete]._id}`,
            type: 'DELETE',
            data: {
              user_id: sessionStorage['userID']
            },
            success: function(data) {
              if (data == 'deleted') {
                showUserListings();
              } else {
                alert('Enter a valid id');
              } //else
            }, //success
            error: function() {} //error
          }); //ajax
        } // Delete Product Funtion ENds

        // update function
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
                if (data == '401 error: user has no permission to update') {
                  alert('401 error: user has no permission to update');
                } else {
                  alert('updated');
                  $("#updateProductForm").modal("hide");
                  showUserListings();
                } //else Ends
              }, //success Ends
              error: function() {} //error Ends
            }); //ajax Ends
          }); //updateProduct click function
        } //update product function
      }, // Show User Listings success function ends
      error: function() {}
    }); // patch ajax ends
  } // show user listings function ends

  if (listingContainer) {
    showUserListings();
  }

  //animation for loader
  var circle1 = anime({
    targets: ['.circle-1'],
    translateY: -24,
    translateX: 42,
    direction: 'alternate',
    loop: true,
    elasticity: 400,
    easing: 'easeInOutElastic',
    duration: 1600,
    delay: 800,
  });

  var circle2 = anime({
    targets: ['.circle-2'],
    translateY: 24,
    direction: 'alternate',
    loop: true,
    elasticity: 400,
    easing: 'easeInOutElastic',
    duration: 1600,
    delay: 800,
  });

  var circle3 = anime({
    targets: ['.circle-3'],
    translateY: -24,
    direction: 'alternate',
    loop: true,
    elasticity: 400,
    easing: 'easeInOutElastic',
    duration: 1600,
    delay: 800,
  });

  var circle4 = anime({
    targets: ['.circle-4'],
    translateY: 24,
    translateX: -44,
    direction: 'alternate',
    loop: true,
    elasticity: 400,
    easing: 'easeInOutElastic',
    duration: 1600,
    delay: 800,
  });
  //animations Ends
}); // doc ready ends
