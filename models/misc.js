

const { Schema, model } = require('mongoose');
const logger = require('../config/components/logger')

const HomiliaData = new Schema({
    _id: { type: Number, default: 1 },
    fileAudioName: { type: String, default: '' },
    fileVideoName: { type: String, default: '' },
    fileImageName: { type: String, default: '' },
    audioDuration: { type: Number, default: ''},
    urlAudio: { type: String, default: '' },
    urlVideo: { type: String, default: '' },
    urlImage: { type: String, default: '' },
    date: { type: Date, default: Date.now }
}
)

const homiliaModelName = 'homiliaData'
const HomiliaModel = model(homiliaModelName, HomiliaData)

const initCollection = async () => {
    const count = await HomiliaModel.countDocuments({});
    // console.log(count);
    if (!count) {
        const misch = new HomiliaModel({ _id: 1 });
        try {
            await misch.save();
        }
        catch (err) {
            logger.error(err);
        }
    } else logger.info(' > Homilia collection is not empty');
}
initCollection();


// Set Name and Url of Audio in Homilia Data 

exports.updateAudioData = async (fileAudioName, urlAudio) => {
    const homilia = await HomiliaModel.findOne({ _id: 1 });
    homilia.fileAudioName = fileAudioName;
    homilia.urlAudio = urlAudio;
    try {
        await homilia.save();
    }
    catch (err) {
        logger.error(err);
    }
}

// Get Url and name of audio
exports.getHomiliaData = async () => {
    const homilia = await HomiliaModel.findOne({ _id: 1 });
    //console.log(homilia);
    return homilia;

}

exports.updateAudioTime = async (audioDuration) => {
    const homilia = await HomiliaModel.findOne({ _id: 1 });
    homilia.audioDuration = audioDuration;
    try {
        await homilia.save();
    }
    catch (err) {
        logger.error(err);
    }
}

exports.setHomiliaDataToDefault = async () => {
    const homilia = await HomiliaModel.findOne({ _id: 1 });
    homilia.fileAudioName = '';
    homilia.urlAudio = '';
    homilia.audioDuration = '';
    try {
        await homilia.save();
    }
    catch (err) {
        logger.error(err);
    }
}
