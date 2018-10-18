module.exports = [
    {
      "id": "fastqc",
      "name": "FastQC",
      "description": "FastQC aims to provide a simple way to do some quality control checks on raw sequence data coming from high throughput sequencing pipelines. It provides a modular set of analyses which you can use to give a quick impression of whether your data has any problems of which you should be aware before doing any further analysis.",
      "define-output": "-o",
      "commands":[
        {
          "name": null,
          "id": "fastqc",
          "description": null,
          "args":{
            "required":[],
            "optional":[
              {
                "name": "Casava",
                "id": "--casava",
                "description": "Files come from raw casava output. Files in the same sample group (differing only by the group number) will be analysed as a set rather than individually. Sequences with the filter flag set in the header will be excluded from the analysis. Files must have the same names given to them by casava (including being gzipped and ending with .gz) otherwise they won't be grouped together correctly",
                "inputType": "boolean",
                "required": false,
                "place-holder": null,
                "dependencies": null,
                "options": null,
              },
              {
                "name": "No Filter",
                "id": "--nofilter",
                "description": "If running with --casava then don't remove read flagged by casava as poor quality when performing the QC analysis.",
                "inputType": "boolean",
                "required": false,
                "place-holder": null,
                "dependencies": ["casava"],
                "options": null,
              },
              {
                "name": "No Group",
                "id": "--noGroup",
                "description": "Disable grouping of bases for reads >50bp. All reports will show data for every base in the read.  WARNING: Using this option will cause fastqc to crash and burn if you use it on really long reads, and your plots may end up a ridiculous size. You have been warned!",
                "inputType": "boolean",
                "required": false,
                "place-holder": null,
                "dependencies": null,
                "options": null,
              },
              {
                "name": "Format",
                "id": "--format",
                "description": "Bypasses the normal sequence file format detection and forces the program to use the specified format.  Valid formats are bam,sam,bam_mapped,sam_mapped and fastq",
                "inputType": "selection",
                "required": false,
                "place-holder": "fastq",
                "dependencies": null,
                "options": ["bam", "sam", "bam_mapped", "sam_mapped", "fastq"],
              },
              {
                "name": "Threads",
                "id": "--threads",
                "description": "Specifies the number of files which can be processed simultaneously.  Each thread will be allocated 250MB of memory so you shouldn't run more threads than your available memory will cope with, and not more than 6 threads on a 32 bit machine",
                "inputType": "selection",
                "required": false,
                "place-holder": "1",
                "dependencies": null,
                "options": ['1', '2', '3', '4', '5'],
              }
            ],
          },
          "conflicting-args":[["noextract", "extract"]],
        }
      ],
    },

    /*
      ---- Test Scripts ----
    */

    /*
    {
      "name": "Qiime2",
      "description": "When people ask me what Qiime is, I like to tell them my true feelings on qiime. Qieeme is crap. It horrible. It's a plague sent down to punish us for our sins. But it's a decent Biotool.",
      "id": "Qiime2",
      "commands":[],
    },
    */
];
