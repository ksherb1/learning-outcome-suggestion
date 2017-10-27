// this script pulls data from a tab-delimited two column file
//  treats the first column as the "name",
//  treats the second column as the "outcome",
//  and pushes each record to the outcome collection, author "CAE 2014"

require('../useme');

import * as lineReader from 'line-reader';
import * as db from '../db.driver';
import * as glue from '../db.interactor';
import { StandardOutcome } from '../entity/outcome';

const file = "dbcontent/CAE-CD_Knowledge_Units.dat";   // the data file

export async function CAE() {
    let cnt = 0;    // track how many records we insert

    // what to do for each record
    lineReader.eachLine(file, function(line, last) {
        let dat = line.split('\t');
        if(dat.length == 2) {
            let outcome = new StandardOutcome("CAE 2014", dat[0], dat[1]);
            glue.addStandardOutcome(outcome)   // asynchronous
                .catch((err)=>{console.log("Failed to insert: "+err)});
            cnt += 1;
        } else {    // data formatting error
            console.log("Could not process line: "+line);
        }

        // if we just processed the last line, exit gracefully
        if(last) {
            console.log("Added "+cnt+" records");
        }
    });

    return Promise.resolve();   // FIXME: adding the outcomes isn't necessarily done yet!!!
}

if (require.main === module) {
    db.connect()
      .then(async () => {
        await CAE();
        setTimeout(db.disconnect, 2000);
      }).catch((err)=>{
        console.log(err);
        db.disconnect();
      });
}