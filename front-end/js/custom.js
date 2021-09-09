(function() {
// Getting config.json from front end
let url;
$.ajax({
  url: 'config.json',
  type: 'GET',
  dataType: 'json',
  success: function(configData) {
    console.log(configData.SERVER_URL, configData.SERVER_PORT);
    url = `${configData.SERVER_URL}:${configData.SERVER_PORT}`;
    console.log(url);
  },
  error: function(error) {
    console.log(error);
  }
}) //ajax Ends


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
event.preventDefault()//this prevents code breaking when no data is found
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
          console.log(user + "wahoo");

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

          }
        }, //success
        error: function() {
          console.log('error: cannot call api');
        } //errror

      }); //ajax
    } //if else
  });

  // //logout
  // $('#logout').click(function() {
  //   sessionStorage.clear();
  //   console.log('You are logged out');
  //   console.log(sessionStorage);
  //   $('#loginOverlay').css('display', 'flex')
  //   location.href = "index.html";
  // });
  // $('.header-user').text(sessionStorage.getItem('userName'));




}()); // iife ends
