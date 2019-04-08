const mongoose = require('mongoose');
const TODO = require('../models/todo');
const Joi = require('joi');

exports.getTodos = (req, res, next) => {
  TODO.find()
    .exec()
    .then(todos => {
      return res.status(200).json({
        todos: todos
      })
    })
    .catch(err => {
      next({
        message: 'error in getting all todos.'
      })
      // return res.status(404).json({
      //   todos: 'error'
      // })
    })
}

exports.getSingleTodo = (req, res, next) => {
  TODO.find({_id: req.params.id})
    .exec()
    .then(todos => {
      return res.status(200).json({
        todos: todos
      })
    })
    .catch(err => {
      next({
        message: 'error in gttting single todo',
        status: 404
        // error: err
      });
    })
}

exports.createTodo = (req, res, next) => {
  let valid = Joi.validate(req.body, Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required()
  }));
  if(valid.error){
    return next({
      message: valid.error,
      status: 400
    })
  }
  console.log('after validation!')
  let todo = new TODO({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    description: req.body.description
  })

  todo.save()
    .then(newTodo => {
      return res.status(200).json({
        todos: newTodo
      })
    })
    .catch(err =>{
      next({
        message: 'error in saving todo',
        status: 404,
        error: err
      })
    })
}