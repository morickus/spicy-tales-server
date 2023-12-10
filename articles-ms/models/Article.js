import mongoose from 'mongoose'

const ArticleSchema = new mongoose.Schema({
	title: {type: String, required: true},
	fileName: {type: String, required: true},
	shortDescription: {type: String, default: ''},
	// category: [{type: mongoose.Schema.Types.ObjectId, ref: 'Category'}],
	category: {type: Array, default: []},
	tags: {type: Array, default: []},
	views: {type: Number, default: 0},
	// author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
}, {timestamps: true})

export default mongoose.model('Article', ArticleSchema)