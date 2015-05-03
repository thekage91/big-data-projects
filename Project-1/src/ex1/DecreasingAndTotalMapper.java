package ex1;


import java.io.IOException;
import java.util.StringTokenizer;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

public class DecreasingAndTotalMapper extends Mapper<LongWritable, Text, Text, IntWritable> {

	private static final IntWritable one = new IntWritable(1);
	private static final Text word = new Text();
	
	@Override
	public void map(LongWritable key, Text value,
			Context context)
			throws IOException, InterruptedException {

		String line = value.toString();
		StringTokenizer lineTokenized = new StringTokenizer(line, ",");
		
		lineTokenized.nextToken();
		
		while(lineTokenized.hasMoreTokens()){
			word.set(lineTokenized.nextToken());
			context.write(word,one);
			
		};
	}

}
