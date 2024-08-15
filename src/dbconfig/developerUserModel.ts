import { DataTypes, Model } from 'sequelize'
import sequelize from './dbconfig'
import User from './userModel'

class Developer extends Model {}

Developer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Please provide a username' }
      }
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    resume: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      },
      validate: {
        notEmpty: { msg: 'Please provide a username' }
      }
    }
  },
  {
    sequelize,
    modelName: 'vuexy_developers',
    timestamps: false
  }
)
Developer.belongsTo(User, { as: 'creator', foreignKey: 'created_by' })

export default Developer
