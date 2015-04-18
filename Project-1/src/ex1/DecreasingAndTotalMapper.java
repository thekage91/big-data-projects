package ex1;

import java.io.IOException;
import java.util.StringTokenizer;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapred.MapReduceBase;
import org.apache.hadoop.mapred.Mapper;
import org.apache.hadoop.mapred.OutputCollector;
import org.apache.hadoop.mapred.Reporter;

public class DecreasingAndTotalMapper extends MapReduceBase implements Mapper<LongWritable, Text, Text, IntWritable> {

	private static final IntWritable one = new IntWritable(1);
	private static final Text word = new Text();
	
	@Override
	public void map(LongWritable arg0, Text arg1,
			OutputCollector<Text, IntWritable> output, Reporter arg3)
			throws IOException {

		String line = arg1.toString();
		StringTokenizer lineTokenized = new StringTokenizer(line, ",");
		
		while(lineTokenized.hasMoreTokens()){
			word.set(lineTokenized.nextToken());
			output.collect(word,one);	
		};
	}

}
