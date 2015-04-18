package ex1;

import java.io.IOException;
import java.util.Comparator;
import java.util.Iterator;
import java.util.PriorityQueue;

import org.apache.hadoop.io.DoubleWritable;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapred.MapReduceBase;
import org.apache.hadoop.mapred.OutputCollector;
import org.apache.hadoop.mapred.Reducer;
import org.apache.hadoop.mapred.Reporter;
import org.apache.hadoop.mapreduce.Reducer.Context;

/*
import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;
import java.util.PriorityQueue;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.conf.Configured;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.DoubleWritable;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapred.MapReduceBase;
import org.apache.hadoop.mapred.OutputCollector;
import org.apache.hadoop.mapred.Reporter;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.input.KeyValueTextInputFormat;
import org.apache.hadoop.mapreduce.lib.input.TextInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import org.apache.hadoop.util.StringUtils;
import org.apache.hadoop.util.Tool;
import org.apache.hadoop.util.ToolRunner;
*/

public class DecreasingAndTotalReducer extends MapReduceBase implements Reducer<Text, IntWritable, Text, DoubleWritable>{

	private PriorityQueue<SaleLine> queue;
    
    protected void setup(Context ctx) {
    	
      queue = new PriorityQueue<SaleLine>(new Comparator<SaleLine>() {
        public int compare(SaleLine s1, SaleLine s2) {
          return s1.count.compareTo(s2.count);
        }
      });
    }

	public void reduce(Text key, Iterator<IntWritable> arg1,
			OutputCollector<Text, DoubleWritable> output, Reporter arg3)
			throws IOException {

		int sum = 0;
		
		while(arg1.hasNext()){
			sum += arg1.next().get();
		}
		
		output.collect(key, new DoubleWritable(sum));
	}

}
