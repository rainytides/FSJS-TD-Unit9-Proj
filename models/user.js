'use strict';

const sequelize = require('sequelize');
const { Sequelize } = require('.');

module.exports = (sequelize, DataTypes) => {
    class User extends sequelize.Model {}
    User.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A first name is required'
                },
                notEmpty: {
                    msg: 'Please provide a first name'
                }
            }
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A last name is required'
                },
                notEmpty: {
                    msg: 'Please provide a last name'
                }
            }
        },
        emailAddress: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'An email address is required'
                },
                notEmpty: {
                    msg: 'Please provide an email address'
                },
                isEmail: {
                    msg: 'Please provide a valid email address'
                }
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A password is required'
                },
                notEmpty: {
                    msg: 'Please provide a password'
                }
            }
        },
    }, { sequelize });

    User.associate = (models) => {
        User.hasMany(models.Course, {
            as: 'courses',
            foreignKey: {
                name: 'userId',
                allowNull: false
            }
        })
        };

    return User;
    };