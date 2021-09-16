
$(document).ready(function() {
var results = document.querySelector('#results')

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

  }) //ajax










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
    let userName = $('#regUsername').val();
    let email = $('#regEmail').val();
    let password = $('#regPassword').val();
    console.log(userName, email, password);

    if (userName == '' || email == '' || password == '') {
      alert('Please enter all details');

    } else {
      $.ajax({
        url: `${url}/registerUser`,
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
    let userName = $('#userName').val();
    let password = $('#password').val();

    console.log(userName,
      password); //remove after development for security

    if (userName == '' || password == '') {
      alert('Please enter all details');
    } else {
      $.ajax({
        url: `${url}/loginUser`,
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
            $('#username').val('');
            $('#password').val('');
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
  var logout = document.querySelectorAll('.logoutBtn')
    for (var i = 0; i < logout.length; i++) {
      logout[i].onclick = function(){
        sessionStorage.clear();
        console.log('You are logged out');
        console.log(sessionStorage);
        // $('#loginOverlay').css('display', 'flex')
        location.href = "index.html";
      }
    }


  // $('.header-user').text(sessionStorage.getItem('userName'));

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Add Listing method:::::::::::::::::::::::::::::::::::::::::::::::::::::
// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  $('#listItem').click(function() {
    event.preventDefault();
    let listTitle = $('#listTitle').val();
    let price = $('#listPrice').val();
    let genre = $('#listGenre').val();
    let listConsole = $('#listConsole').val();
    let description = $('#listDescription').val();
    let imgUrl = $('#listImg').val();
    let condition = $('#listCondition').val();
    let userId = sessionStorage.getItem('userID');

    console.log(listTitle, price); //remove after development for security

    if (listTitle == '' || price == '') {
      alert('Title and price information are required');
    } else {
      // modal show
      $("#listConfirmationModal").modal("show");

      $("#confirmListing").click(function() {
        $.ajax({
          url: `${url}/addProduct`,
          type: 'POST',
          data: {
            name: listTitle,
            price: price,
            image: imgUrl,
            console: listConsole,
            genre: genre,
            description: description,
            condition: condition,
            seller: "bob",
            itemLocation: 'south',
            created_at: Date.now(),
            user_id:userId
          },
          success: function(product) {

            window.location = "landing.html"

          }, //success
          error: function() {
            console.log('error: cannot call api');
          } //errror

        }); //ajax
      });

    } //if else
  });


// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// display all results on landing page::::::::::::::::::::::::::::::::::::::::::::
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function showAllResults(){

    $.ajax({
      url: `http://localhost:3002/allProductsFromDB`,
      type: 'GET',
      dataType: 'json',
      success: function(productsFromMongo) {
        console.log(productsFromMongo);
        console.log(url + "weirrrd");
        var i;

        for (i = 0; i < productsFromMongo.length; i++) {
          // create card div for each item
          var productCard = document.createElement("div")
          results.appendChild(productCard)
          productCard.classList.add('card', 'mx-4', 'my-4', 'lg-4');
          // fill the cards content
          productCard.innerHTML =`
            <img src="${productsFromMongo[i].image}" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">${productsFromMongo[i].name}</h5>
              <p class="card-text">${productsFromMongo[i].description}</p>
              <p class="price">${productsFromMongo[i].price}</p>
            </div>
          `
        }
      }, // submit success fuction ends
      error: function() {
        console.log("");
      }
    }) //ajax
}

if (results) {
  showAllResults()
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
  //     success: function(projectsFromMongo) {
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
  // }) // Submit/all projects from mongo call ends


  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  //    Show user listings  :::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


  function showUserListings(){
    var currentUser = "ObjectId(" + sessionStorage.getItem('userID') +")";
    console.log(currentUser + ' is the man');

    $.ajax({
      url: `http://localhost:3002/allProductsFromDB/userListings`,
      type: 'GET',
      dataType: 'json',
      data:{
        user_id:currentUser
      },
      success: function(productsFromMongo) {
        console.log(productsFromMongo);
        var i;
        var listingContainer = document.querySelector('#listingContainer')
        for (i = 0; i < productsFromMongo.length; i++) {
          // create card div for each item
          var productCard = document.createElement("div")
          listingContainer.appendChild(productCard)
          productCard.classList.add('card', 'mx-4', 'my-4');
          // fill the cards content
          productCard.innerHTML =`
            <img src="${productsFromMongo[i].image}" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">${productsFromMongo[i].name}</h5>
              <p class="card-text">${productsFromMongo[i].description}</p>
              <p class="price">${productsFromMongo[i].price}</p>
            </div>
            <div class="card-footer bg-transparent align-self-end">
              <div class="btn-group" role="group" aria-label="Basic outlined example">
                <button type="button" class="btn btn-outline-warning"><i class="fa fa-pencil" aria-hidden="true"></i>
                </button>
                <button type="button" class="btn btn-outline-warning"><i class="fa fa-trash" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          `
        }
      }, // submit success fuction ends
      error: function() {}
    }) //ajax
  }
showUserListings();

}); // doc ready ends
