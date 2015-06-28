package ex2;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.hadoop.mapreduce.Mapper;

import java.io.IOException;
import java.util.NoSuchElementException;
import java.util.StringTokenizer;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.*;

public class SecondStepMapper extends Mapper<LongWritable, Text, Text, Text> {
	public static final Log LOG = LogFactory.getLog(SecondStepMapper.class);
	
	public void map(LongWritable key, Text value,
				Context context)
				throws IOException, InterruptedException {
	
	StringTokenizer st = new StringTokenizer(value.toString());
	String prodotto = st.nextToken();
	String meseAnno = st.nextToken();
	String quanto = st.nextToken();
	String valueOut = meseAnno + ":" + quanto;
	LOG.debug("out = "+ prodotto + "->"+ value);
	context.write(new Text(prodotto),new Text(valueOut));
	}
	
	}
	


