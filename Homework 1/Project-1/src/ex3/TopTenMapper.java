package ex3;


import org.apache.hadoop.mapreduce.Mapper;

import java.io.IOException;
import java.util.StringTokenizer;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;

public class TopTenMapper extends Mapper<LongWritable,Text,Text,IntWritable>  {

	private Text word1 = new Text();
	private Text word2 = new Text();

	public void map(LongWritable key, Text value,
			Context context)
			throws IOException, InterruptedException {
	
		
		String line = value.toString();
		StringTokenizer tokenizer1 = new StringTokenizer(line, ","); 
		StringTokenizer tokenizer2;
		int pos1 = 0; 
		int pos2 = 0;
		String pair = "";
		
		/* vado avanti di uno cosi' ignoro la data */
		tokenizer1.nextToken();
		
		while(tokenizer1.hasMoreTokens()){
			word1.set(tokenizer1.nextToken());
			tokenizer2 = new StringTokenizer(line, ","); 

			/* vado avanti di uno cosi' ignoro la data */
			tokenizer2.nextToken();
			tokenizer2.nextToken();

			pos1 += 1;
			
			while(tokenizer2.hasMoreTokens()){
				if(pos1 < pos2){
					word2.set(tokenizer2.nextToken());
					pair = word1.toString() + "," + word2.toString();
					context.write(new Text(pair), new IntWritable(1));
				}
				pos2 += 1;
			}
		}
	}

}
