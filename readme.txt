//models.......
User
  _id
  email
  name
  password
  username
  otp
  account_status
  profile{
    UserProfile
    orgProfile
  }
  money_account_details               //optional

orgProfile
  money_account_details_status
  organisedGames

Games
  name
  description
  fcn                                 // formal company name of the game
  palyModes                           //single ,duo , four (according to game)
  genere                              // type of game  


//todo_________________________________________________________________________________________________
complain system
chat system



























// cost calculation

const p = 100;                     // p => players

const percent = value => {
  return value / 100;
};

const totalprize = x => {
  return 25 * x;
};

const profit = (fee, percent) => {
  console.log(
    `Player 1 : ${10 * fee}\nPlayer 2 : ${5 * fee}\nPlayer 3 : ${3 *
      fee}\nPlayer 4 : ${fee}\nPlayer 5 : ${fee}\nPlayer 6 : ${fee}\nPlayer 7 : ${fee}\nPlayer 8 : ${fee}\nPlayer 9 : ${fee}\nPlayer 10 : ${fee}\n`
  );
  console.log("Organizer Profit : ", p * fee - totalprize(fee));
  console.log("Our Profit : ", (p * fee - totalprize(fee)) * percent);
};

profit(25, percent(25));


