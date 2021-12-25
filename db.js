import { Sequelize, DataTypes } from 'sequelize';

const connect = async () => {
	const sequelize = new Sequelize({
		dialect: 'sqlite',
		storage: 'db.sqlite',
		logging: false,
	});
	return sequelize;
};

const db = await connect();
const Chapter = db.define('Chapter', {
	manga: { type: DataTypes.STRING, allowNull: false },
	title: { type: DataTypes.STRING, allowNull: false },
	url: { type: DataTypes.STRING, allowNull: false },
	date: { type: DataTypes.DATE, allowNull: true },
});
await Chapter.sync();
export { db, Chapter };

