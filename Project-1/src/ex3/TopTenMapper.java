package ex3;


import java.io.IOException;
import java.util.StringTokenizer;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapred.MapReduceBase;
import org.apache.hadoop.mapred.Mapper;
import org.apache.hadoop.mapred.OutputCollector;
import org.apache.hadoop.mapred.Reporter;

public class TopTenMapper extends MapReduceBase implements Mapper<LongWritable, Text, Text, IntWritable> {

	private Text word1 = new Text();
	private Text word2 = new Text();

	@Override
	public void map(LongWritable arg0, Text value,
			OutputCollector<Text, IntWritable> output, Reporter arg3)
			throws IOException {
		
		String line = value.toString();
		StringTokenizer tokenizer1 = new StringTokenizer(line, ","); 
		StringTokenizer tokenizer2;
		int pos1 = 0; 
		int pos2 = 0;
		
		while(tokenizer1.hasMoreTokens()){
			word1.set(tokenizer1.nextToken());
			tokenizer2 = new StringTokenizer(line, ","); 
			pos1 += 1;
			
			while(tokenizer2.hasMoreTokens()){
				if(pos1 < pos2){
					word2.set(tokenizer2.nextToken());
					pos2 += 1;
				}
				output.collect(arg0, arg1);
			}
		}
	}

}
