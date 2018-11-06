import _ from 'lodash';

export default class RegExWrapper {

	constructor( regexObjectOrMatch, replaceString ){
		if( !_.isString(regexObjectOrMatch) ){
			this.matchRegEx = regexObjectOrMatch.match;
			this.replaceString = regexObjectOrMatch.replace;
		}else{
			this.matchRegEx = regexObjectOrMatch;
			this.replaceString = replaceString;
		}

		if( _.isString(this.matchRegEx) ) this.matchRegEx = new RegExp(this.matchRegEx);
	}

	matches( string ){
		return string.match( this.matchRegEx ) !== null;
	}

	shouldReplace(){
		return !!this.replaceString;
	}

	replace( string ){
		return string.replace( this.matchRegEx, this.replaceString );
	}

}