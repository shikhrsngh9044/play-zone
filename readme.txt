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

UserProfile
  _id
  games{
    name
    payerId
  }
  playedGames                         //details of matches user palyedGames

orgProfile
  money_account_details_status
  organisedGames

Games
  name
  description
  fcn                                 // formal company name of the game
  palyModes                           //single ,duo , four (according to game) 




