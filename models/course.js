'use strict';

const sequelize = require('sequelize');

module.exports = (sequelize) => {
    class Course extends sequelize.Model {}
    Course.init({
        id: {
            type: sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A title is required'
                },
                notEmpty: {
                    msg: 'Please provide a title'
                }
            }
        },
        description: {
            type: sequelize.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A description is required'
                },
                notEmpty: {
                    msg: 'Please provide a description'
                }
            }
        },
        estimatedTime: {
            type: sequelize.STRING,
            allowNull: true
        },
        materialsNeeded: {
            type: sequelize.STRING,
            allowNull: true
        }
    }, { sequelize });

    Course.associate = (models) => {
        Course.belongsTo(models.User, {
            as: 'user',
            foreignKey: {
                name: 'userId',
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'A user ID is required'
                    },
                    notEmpty: {
                        msg: 'Please provide a user ID'
                    }
                }
            }
        })
    };

    return Course;
};
